// Service handling authentication proxy flows and institution lookup via Supabase.

import { supabase, supabaseAuth } from '../config/supabase.js';

/**
 * Resolves and verifies the target institution_id for user signup.
 * Falls back to the earliest created institution if none is supplied.
 * @param {string|undefined} institutionId - Optional institution UUID.
 * @returns {Promise<string|null>} Verified institution UUID or null.
 */
export const resolveInstitutionId = async (institutionId) => {
  if (institutionId) {
    const { data, error } = await supabase
      .from('institutions')
      .select('id')
      .eq('id', institutionId)
      .single();

    if (error || !data) {
      const notFound = new Error('Selected institution not found');
      notFound.statusCode = 404;
      throw notFound;
    }
    return data.id;
  }

  const { data: defaultInst } = await supabase
    .from('institutions')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  return defaultInst?.id || null;
};

/**
 * Formats a standard session + user response payload.
 * @param {object} session - Supabase session object.
 * @param {object} authUser - Supabase auth user object.
 * @param {object} profile - User profile row from public.profiles.
 * @returns {object} Normalized auth payload for clients.
 */
export const formatAuthResponse = (session, authUser, profile) => ({
  access_token: session.access_token,
  refresh_token: session.refresh_token,
  expires_at: session.expires_at,
  user: {
    id: authUser.id,
    email: authUser.email,
    full_name: profile.full_name,
    role: profile.role,
    institution_id: profile.institution_id,
    points: profile.points || 0,
  },
});

/**
 * Registers a new user via Supabase Auth admin API and returns an active session.
 * @param {object} payload - Signup fields (full_name, email, password, institution_id, role).
 * @returns {Promise<object>} Session tokens and user profile.
 */
export const signupUser = async ({ full_name, email, password, institution_id, role }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = full_name.trim();
  const normalizedRole = role ? role.toLowerCase() : 'student';
  const resolvedInstitutionId = await resolveInstitutionId(institution_id);

  const { data: createdData, error: createError } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: normalizedName,
      role: normalizedRole,
      institution_id: resolvedInstitutionId,
    },
  });

  if (createError || !createdData?.user) {
    const message = createError?.message || 'Unable to create user account';
    const isDuplicate = message.toLowerCase().includes('already') || message.toLowerCase().includes('exists');
    const authError = new Error(isDuplicate ? 'An account with this email already exists' : message);
    authError.statusCode = isDuplicate ? 409 : 400;
    throw authError;
  }

  const userId = createdData.user.id;

  // Ensure profile row exists and matches requested metadata
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        full_name: normalizedName,
        role: normalizedRole,
        institution_id: resolvedInstitutionId,
      },
      { onConflict: 'id' }
    )
    .select('id, full_name, role, institution_id, points')
    .single();

  if (profileError || !profile) {
    throw profileError || new Error('Failed to initialize user profile');
  }

  const { data: loginData, error: loginError } = await supabaseAuth.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (loginError || !loginData?.session) {
    const sessionError = new Error(loginError?.message || 'Account created, but login failed');
    sessionError.statusCode = 500;
    throw sessionError;
  }

  return formatAuthResponse(loginData.session, loginData.user, profile);
};

/**
 * Authenticates an existing user with email and password.
 * @param {object} credentials - Login email and password.
 * @returns {Promise<object>} Session tokens and user profile.
 */
export const loginUser = async ({ email, password }) => {
  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error || !data?.session || !data?.user) {
    const authError = new Error('Invalid email or password');
    authError.statusCode = 401;
    throw authError;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, role, institution_id, points')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile) {
    const notFound = new Error('User profile not found');
    notFound.statusCode = 401;
    throw notFound;
  }

  return formatAuthResponse(data.session, data.user, profile);
};

/**
 * Refreshes an expired access token using a Supabase refresh token.
 * @param {string} refreshToken - Refresh token issued during login/signup.
 * @returns {Promise<object>} Refreshed access_token, refresh_token, and expires_at.
 */
export const refreshUserSession = async (refreshToken) => {
  const { data, error } = await supabaseAuth.auth.refreshSession({
    refresh_token: refreshToken.trim(),
  });

  if (error || !data?.session) {
    const authError = new Error('Invalid or expired refresh token');
    authError.statusCode = 401;
    throw authError;
  }

  return {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
  };
};

/**
 * Signs out the current session on the server if a Bearer token is provided.
 * @param {string|null} accessToken - Optional Bearer JWT from Authorization header.
 * @returns {Promise<object>} Logout confirmation message.
 */
export const logoutUser = async (accessToken) => {
  if (accessToken && supabase.auth?.admin?.signOut) {
    await supabase.auth.admin.signOut(accessToken).catch(() => null);
  }
  return { message: 'Logged out successfully' };
};

/**
 * Retrieves all registered institutions for signup selection.
 * @returns {Promise<Array>} List of institutions ordered alphabetically by name.
 */
export const listInstitutions = async () => {
  const { data, error } = await supabase
    .from('institutions')
    .select('id, name, state, district')
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
};
