
// Service handling backend-only Supabase Google OAuth flows and profile provisioning.

import crypto from 'crypto';
import { supabase, supabaseAuth } from '../config/supabase.js';
import { formatAuthResponse, resolveInstitutionId } from './authService.js';

const STATE_TTL_MS = 5 * 60 * 1000;
const pendingGoogleStates = new Map();

const pruneExpiredStates = () => {
  const cutoff = Date.now() - STATE_TTL_MS;
  for (const [key, entry] of pendingGoogleStates.entries()) {
    if (entry.createdAt < cutoff) pendingGoogleStates.delete(key);
  }
};

const ensureProfileForUser = async (authUser, fallbackName, institutionId) => {
  const { data: existing } = await supabase
    .from('profiles')
    .select('id, full_name, role, institution_id, points')
    .eq('id', authUser.id)
    .single();
  if (existing) return existing;

  const metaName =
    authUser.user_metadata?.full_name ||
    authUser.user_metadata?.name ||
    fallbackName ||
    authUser.email?.split('@')[0] ||
    'Student';

  const resolvedInstId = await resolveInstitutionId(institutionId);
  const { data: created, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: authUser.id,
        full_name: String(metaName).trim(),
        role: 'student',
        institution_id: resolvedInstId,
      },
      { onConflict: 'id' }
    )
    .select('id, full_name, role, institution_id, points')
    .single();

  if (error || !created) {
    throw error || new Error('Failed to initialize user profile');
  }
  return created;
};

// Starts a Supabase Google OAuth flow and returns the backend launch URL + polling state.
export const startGoogleAuth = async ({ institution_id, baseUrl }) => {
  pruneExpiredStates();
  const state = crypto.randomUUID();
  const redirectTo = `${baseUrl}/api/v1/auth/google/callback`;

  const { data, error } = await supabaseAuth.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      queryParams: { prompt: 'select_account' },
    },
  });

  if (error || !data?.url) {
    const authError = new Error(
      error?.message || 'Unable to start Google Sign-In via Supabase.'
    );
    authError.statusCode = 502;
    throw authError;
  }

  pendingGoogleStates.set(state, {
    status: 'pending',
    oauthUrl: data.url,
    institutionId: institution_id || undefined,
    createdAt: Date.now(),
  });

  return {
    auth_url: `${baseUrl}/api/v1/auth/google/launch?state=${encodeURIComponent(state)}`,
    state,
    expires_in: STATE_TTL_MS / 1000,
  };
};

// Retrieves the stored Supabase Google consent URL for the browser launch redirect.
export const getGoogleLaunchUrl = (state) => {
  pruneExpiredStates();
  const entry = state ? pendingGoogleStates.get(state) : null;
  if (!entry || !entry.oauthUrl) {
    const err = new Error('Google sign-in session not found or expired');
    err.statusCode = 404;
    throw err;
  }
  return entry.oauthUrl;
};

// Validates tokens returned by Supabase's Google OAuth redirect and stores the app session.
export const completeGoogleOAuthSession = async ({
  state,
  access_token,
  refresh_token,
  expires_at,
  error_description,
}) => {
  pruneExpiredStates();
  const pending = pendingGoogleStates.get(state);
  if (!pending) {
    const err = new Error('Google sign-in session not found or expired');
    err.statusCode = 404;
    throw err;
  }

  if (error_description || !access_token) {
    const message = error_description || 'Google sign-in was cancelled or incomplete';
    pendingGoogleStates.set(state, { ...pending, status: 'error', error: message });
    return { ok: false, message };
  }

  const { data: authData, error: userError } = await supabase.auth.getUser(access_token);
  if (userError || !authData?.user) {
    const message = 'Invalid Google authentication token from Supabase';
    pendingGoogleStates.set(state, { ...pending, status: 'error', error: message });
    const err = new Error(message);
    err.statusCode = 401;
    throw err;
  }

  const profile = await ensureProfileForUser(
    authData.user,
    authData.user.user_metadata?.full_name || authData.user.user_metadata?.name,
    pending.institutionId
  );

  const sessionPayload = formatAuthResponse(
    {
      access_token,
      refresh_token: refresh_token || '',
      expires_at: expires_at ? Number(expires_at) : null,
    },
    authData.user,
    profile
  );

  pendingGoogleStates.set(state, { ...pending, status: 'completed', session: sessionPayload });
  return { ok: true, email: sessionPayload.user.email };
};

// Polls and consumes a completed Supabase Google OAuth state session.
export const getGoogleAuthStatus = (state) => {
  pruneExpiredStates();
  const entry = pendingGoogleStates.get(state);
  if (!entry) {
    const err = new Error('Google sign-in session not found or expired');
    err.statusCode = 404;
    throw err;
  }

  if (entry.status === 'pending') {
    return { status: 'pending' };
  }

  pendingGoogleStates.delete(state);
  if (entry.status === 'error') {
    const err = new Error(entry.error || 'Google sign-in failed');
    err.statusCode = 400;
    throw err;
  }

  return { status: 'completed', ...entry.session };
};

// Signs in via Supabase signInWithIdToken for callers submitting a Google id_token directly.
export const loginWithGoogleIdToken = async ({ id_token, institution_id }) => {
  const { data, error } = await supabaseAuth.auth.signInWithIdToken({
    provider: 'google',
    token: id_token.trim(),
  });

  if (error || !data?.session || !data?.user) {
    const authError = new Error(error?.message || 'Invalid Google ID token');
    authError.statusCode = 401;
    throw authError;
  }

  const profile = await ensureProfileForUser(
    data.user,
    data.user.user_metadata?.full_name || data.user.user_metadata?.name,
    institution_id
  );

  return formatAuthResponse(data.session, data.user, profile);
};
