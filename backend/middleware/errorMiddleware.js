// Central error handling and route not found middleware.

import { sendError } from '../utils/responseHelper.js';

/**
 * Handles requests targeting undefined routes by sending a 404 response.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} Express JSON error response.
 */
export const notFoundHandler = (req, res) => {
  return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

/**
 * Catches all unhandled application errors and sends a formatted 500 response.
 * @param {Error} err - Error object thrown in route or controller.
 * @param {object} _req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} _next - Express next middleware callback.
 * @returns {object} Express JSON error response.
 */
export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return sendError(res, message, statusCode);
};

