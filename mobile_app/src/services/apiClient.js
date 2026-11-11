// Centralized HTTP client routing all mobile requests strictly through the Express backend.

import { API_BASE_URL, ENDPOINTS } from '../constants/api';
import { getTokens, saveTokens, clearTokens } from './tokenStorage';

let unauthorizedHandler = null;
let refreshPromise = null;

// Registers a callback invoked when token refresh fails and user must re-authenticate.
export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

// Attempts a single shared token refresh via POST /api/v1/auth/refresh.
const tryRefreshAccessToken = async () => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const { refreshToken } = await getTokens();
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !payload?.data?.access_token) {
        await clearTokens();
        return null;
      }

      await saveTokens(payload.data.access_token, payload.data.refresh_token);
      return payload.data.access_token;
    } catch {
      return null;
    }
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};

// Performs an HTTP request against the Express backend and unwraps { success, data, error }.
export const apiRequest = async (path, options = {}) => {
  const { method = 'GET', body = null, headers = {}, skipAuth = false, _retried = false } = options;

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (!skipAuth) {
    const { accessToken } = await getTokens();
    if (accessToken) {
      requestHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      ...(body !== null ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new Error(
      `Unable to reach the AEVORA server (${API_BASE_URL}). Check your connection and try again.`
    );
  }

  if (response.status === 401 && !skipAuth && !_retried) {
    const refreshedToken = await tryRefreshAccessToken();
    if (refreshedToken) {
      return apiRequest(path, { ...options, _retried: true });
    }
    if (unauthorizedHandler) unauthorizedHandler();
  }

  const payload = await response.json().catch(() => ({
    success: false,
    data: null,
    error: `Unexpected server response (${response.status})`,
  }));

  if (!response.ok || !payload.success) {
    const error = new Error(payload.error || 'Request failed');
    error.status = response.status;
    throw error;
  }

  return payload.data;
};
