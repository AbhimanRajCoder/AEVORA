// Authentication & institution API calls routed exclusively through /api/v1/auth and /api/v1/institutions.

import { ENDPOINTS } from '../constants/api';
import { apiRequest } from './apiClient';
import { saveTokens, clearTokens } from './tokenStorage';

/**
 * Logs in via backend POST /api/v1/auth/login and saves issued tokens.
 */
export const login = async ({ email, password }) => {
  const data = await apiRequest(ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    body: { email, password },
    skipAuth: true,
  });
  await saveTokens(data.access_token, data.refresh_token);
  return data;
};

/**
 * Registers a user via backend POST /api/v1/auth/signup and saves issued tokens.
 */
export const signup = async ({ full_name, email, password, institution_id, role = 'student' }) => {
  const data = await apiRequest(ENDPOINTS.AUTH.SIGNUP, {
    method: 'POST',
    body: { full_name, email, password, institution_id, role },
    skipAuth: true,
  });
  await saveTokens(data.access_token, data.refresh_token);
  return data;
};

/**
 * Fetches current authenticated user profile from GET /api/v1/auth/me.
 */
export const getMe = async () => {
  return apiRequest(ENDPOINTS.AUTH.ME);
};

/**
 * Logs out via backend POST /api/v1/auth/logout and clears local tokens.
 */
export const logout = async () => {
  try {
    await apiRequest(ENDPOINTS.AUTH.LOGOUT, { method: 'POST' });
  } catch {
    // Clear local session even if network call fails
  } finally {
    await clearTokens();
  }
};

/**
 * Fetches institutions list from GET /api/v1/institutions for signup selection.
 */
export const getInstitutions = async () => {
  return apiRequest(ENDPOINTS.INSTITUTIONS, { skipAuth: true });
};

// Starts backend-proxied Supabase Google OAuth and returns { auth_url, state }.
export const startGoogleAuth = async (institution_id) => {
  return apiRequest(ENDPOINTS.AUTH.GOOGLE_START, {
    method: 'POST',
    body: institution_id ? { institution_id } : {},
    skipAuth: true,
  });
};

// Polls backend for completed Supabase Google OAuth session tokens.
export const getGoogleAuthStatus = async (state) => {
  return apiRequest(`${ENDPOINTS.AUTH.GOOGLE_STATUS}?state=${encodeURIComponent(state)}`, {
    skipAuth: true,
  });
};

// Persists tokens returned by a completed Google OAuth session.
export const persistGoogleSession = async ({ access_token, refresh_token }) => {
  await saveTokens(access_token, refresh_token || '');
};

// Signs in via backend POST /api/v1/auth/google with a Google id_token.
export const loginWithGoogleIdToken = async ({ id_token, institution_id }) => {
  const data = await apiRequest(ENDPOINTS.AUTH.GOOGLE_TOKEN, {
    method: 'POST',
    body: { id_token, ...(institution_id ? { institution_id } : {}) },
    skipAuth: true,
  });
  await saveTokens(data.access_token, data.refresh_token || '');
  return data;
};

