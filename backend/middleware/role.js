// Role-based authorization middleware restricting access based on user role.

import { sendError } from '../utils/responseHelper.js';

/**
 * Middleware restricting access to users with the 'admin' role.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {void} Calls next() or returns 403 error.
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return sendError(res, 'Access forbidden: administrator privileges required', 403);
  }
  return next();
};

/**
 * Factory middleware restricting access to specific allowed roles.
 * @param {string[]} allowedRoles - Array of allowed role strings.
 * @returns {function} Express middleware function.
 */
export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return sendError(res, 'Access forbidden: insufficient permissions', 403);
    }
    return next();
  };
};

