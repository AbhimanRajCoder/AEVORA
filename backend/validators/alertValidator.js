// Request body validation middleware for alert creation.

import { sendError } from '../utils/responseHelper.js';

const VALID_SEVERITIES = ['info', 'warning', 'critical'];

/**
 * Validates that req.body contains valid title, message, and severity for an alert.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {void} Calls next() or returns 400 Bad Request.
 */
export const validateAlertCreation = (req, res, next) => {
  const { title, message, severity } = req.body || {};

  if (!title || typeof title !== 'string' || !title.trim()) {
    return sendError(res, 'Alert title is required and must be a valid text string', 400);
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    return sendError(res, 'Alert message is required and must be a valid text string', 400);
  }

  if (severity != null && (typeof severity !== 'string' || !VALID_SEVERITIES.includes(severity.toLowerCase()))) {
    return sendError(
      res,
      `Invalid severity level. Allowed values: ${VALID_SEVERITIES.join(', ')}`,
      400
    );
  }

  return next();
};

