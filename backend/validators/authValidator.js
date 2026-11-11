// Request body validation middleware for authentication endpoints.

import { sendError } from '../utils/responseHelper.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ALLOWED_ROLES = ['student', 'admin'];
const MIN_PASSWORD_LENGTH = 6;

/**
 * Validates signup request payload (full_name, email, password, optional institution_id and role).
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const validateSignup = (req, res, next) => {
  const { full_name, email, password, institution_id, role } = req.body || {};

  if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
    return sendError(res, 'Full name is required and must be a valid text string', 400);
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return sendError(res, 'A valid email address is required', 400);
  }

  if (!password || typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    return sendError(res, `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`, 400);
  }

  if (institution_id !== undefined && institution_id !== null && institution_id !== '') {
    if (typeof institution_id !== 'string' || !UUID_REGEX.test(institution_id)) {
      return sendError(res, 'Invalid institution_id format: must be a valid UUID', 400);
    }
  }

  if (role !== undefined && role !== null && role !== '') {
    if (typeof role !== 'string' || !ALLOWED_ROLES.includes(role.toLowerCase())) {
      return sendError(res, `Invalid role. Allowed values: ${ALLOWED_ROLES.join(', ')}`, 400);
    }
  }

  return next();
};

/**
 * Validates login request payload (email and password).
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return sendError(res, 'A valid email address is required', 400);
  }

  if (!password || typeof password !== 'string') {
    return sendError(res, 'Password is required', 400);
  }

  return next();
};

/**
 * Validates refresh token request payload.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const validateRefresh = (req, res, next) => {
  const { refresh_token } = req.body || {};

  if (!refresh_token || typeof refresh_token !== 'string' || !refresh_token.trim()) {
    return sendError(res, 'refresh_token is required', 400);
  }

  return next();
};

