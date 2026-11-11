// Controller handling HTTP requests for authentication and institution listings.

import {
  signupUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  listInstitutions,
} from '../services/authService.js';
import {
  startGoogleAuth,
  getGoogleLaunchUrl,
  completeGoogleOAuthSession,
  getGoogleAuthStatus,
  loginWithGoogleIdToken,
} from '../services/googleAuthService.js';
import { sendError, sendSuccess } from '../utils/responseHelper.js';

/**
 * Handles POST /api/v1/auth/signup to create a user account and return tokens.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const signup = async (req, res, next) => {
  try {
    const result = await signupUser(req.body);
    return sendSuccess(res, result, 201);
  } catch (error) {
    return next(error);
  }
};

/**
 * Handles POST /api/v1/auth/login to authenticate with email and password.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    return sendSuccess(res, result, 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * Handles POST /api/v1/auth/refresh to obtain a new access token.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const refresh = async (req, res, next) => {
  try {
    const result = await refreshUserSession(req.body.refresh_token);
    return sendSuccess(res, result, 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * Handles POST /api/v1/auth/logout to close the active user session.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const result = await logoutUser(token);
    return sendSuccess(res, result, 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * Handles GET /api/v1/auth/me to return the authenticated user's profile.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
export const getMe = (req, res) => {
  return sendSuccess(res, req.user, 200);
};

/**
 * Handles GET /api/v1/institutions to list institutions for signup selection.
 * @param {object} _req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const getInstitutions = async (_req, res, next) => {
  try {
    const institutions = await listInstitutions();
    return sendSuccess(res, institutions, 200);
  } catch (error) {
    return next(error);
  }
};

const renderCallbackBridgeHtml = () => `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AEVORA Google Sign-In</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#122314;color:#fff;font-family:system-ui,-apple-system,sans-serif;padding:24px;}
.card{max-width:420px;width:100%;border:1px solid #30322a;border-radius:16px;padding:32px;text-align:center;}
.badge{display:inline-block;padding:6px 14px;border-radius:999px;font-size:12px;font-weight:700;background:#68ef3f;color:#222;margin-bottom:16px;}
h1{margin:0 0 12px;font-size:24px;}p{margin:0;color:#b7bda5;line-height:1.5;}</style></head>
<body><div class="card"><div class="badge" id="badge">VERIFYING</div>
<h1 id="title">Completing Google Sign-In...</h1><p id="msg">Please wait a moment.</p></div>
<script>
(async function(){
  var q = new URLSearchParams(window.location.search);
  var h = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  var state = q.get('state') || '';
  var payload = {
    state: state,
    access_token: h.get('access_token') || '',
    refresh_token: h.get('refresh_token') || '',
    expires_at: h.get('expires_at') || '',
    error_description: q.get('error_description') || h.get('error_description') || q.get('error') || ''
  };
  try {
    var res = await fetch('/api/v1/auth/google/complete', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    var json = await res.json();
    if (res.ok && json.success && json.data && json.data.ok) {
      document.getElementById('badge').textContent = 'AEVORA VERIFIED';
      document.getElementById('title').textContent = 'Signed in to AEVORA';
      document.getElementById('msg').textContent = 'Verified ' + (json.data.email || '') + '. Return to the AEVORA app to continue.';
    } else {
      document.getElementById('badge').textContent = 'SIGN-IN NOTICE';
      document.getElementById('title').textContent = 'Google Sign-In incomplete';
      document.getElementById('msg').textContent = (json && (json.error || (json.data && json.data.message))) || 'Return to the AEVORA app and try again.';
    }
  } catch (e) {
    document.getElementById('badge').textContent = 'ERROR';
    document.getElementById('title').textContent = 'Connection error';
    document.getElementById('msg').textContent = 'Return to the AEVORA app and try again.';
  }
})();
</script></body></html>`;

const readCookie = (cookieHeader = '', name) => {
  const match = String(cookieHeader).match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : '';
};

const getRequestBaseUrl = (req) => {
  const configured = process.env.BACKEND_PUBLIC_URL?.trim() || process.env.RENDER_EXTERNAL_URL?.trim();
  if (configured) return configured.replace(/\/+$/, '');
  const host = req.get?.('host') || 'localhost:5000';
  return `${req.protocol || 'http'}://${host}`;
};

// Handles POST /api/v1/auth/google/start to generate Supabase Google launch URL & state.
export const startGoogle = async (req, res, next) => {
  try {
    const result = await startGoogleAuth({
      institution_id: req.body?.institution_id,
      baseUrl: getRequestBaseUrl(req),
    });
    return sendSuccess(res, result, 200);
  } catch (error) {
    return next(error);
  }
};

// Handles GET /api/v1/auth/google/launch setting OAuth state cookie and redirecting to Supabase.
export const googleLaunch = (req, res, next) => {
  try {
    const state = req.query?.state;
    const oauthUrl = getGoogleLaunchUrl(state);
    res.setHeader(
      'Set-Cookie',
      `aevora_oauth_state=${encodeURIComponent(state)}; Path=/api/v1/auth; HttpOnly; SameSite=Lax; Max-Age=300`
    );
    return res.redirect(302, oauthUrl);
  } catch (error) {
    return next(error);
  }
};

// Handles GET /api/v1/auth/google/callback serving the hash-to-backend bridge page.
export const googleCallback = (_req, res) => {
  res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.send(renderCallbackBridgeHtml());
};

// Handles POST /api/v1/auth/google/complete to verify Supabase OAuth tokens on backend.
export const googleComplete = async (req, res, next) => {
  try {
    const state = req.body?.state || readCookie(req.headers?.cookie, 'aevora_oauth_state');
    const result = await completeGoogleOAuthSession({ ...req.body, state });
    res.setHeader(
      'Set-Cookie',
      'aevora_oauth_state=; Path=/api/v1/auth; HttpOnly; SameSite=Lax; Max-Age=0'
    );
    return sendSuccess(res, result, 200);
  } catch (error) {
    return next(error);
  }
};

// Handles GET /api/v1/auth/google/status?state=... for polling completed OAuth sessions.
export const googleStatus = (req, res, next) => {
  try {
    const state = req.query?.state;
    if (!state || typeof state !== 'string') {
      return sendError(res, 'state query parameter is required', 400);
    }
    const result = getGoogleAuthStatus(state);
    return sendSuccess(res, result, 200);
  } catch (error) {
    return next(error);
  }
};

// Handles POST /api/v1/auth/google to verify a Google id_token directly via backend API.
export const googleIdTokenLogin = async (req, res, next) => {
  try {
    const result = await loginWithGoogleIdToken(req.body);
    return sendSuccess(res, result, 200);
  } catch (error) {
    return next(error);
  }
};

