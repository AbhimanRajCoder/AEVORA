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

