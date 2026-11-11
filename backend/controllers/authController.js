// Controller handling HTTP requests for authentication and institution listings.

import {
  signupUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  listInstitutions,
} from '../services/authService.js';
import { sendSuccess } from '../utils/responseHelper.js';

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

