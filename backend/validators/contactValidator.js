// Request body validation middleware for emergency contact creation.

import { sendError } from '../utils/responseHelper.js';

/**
 * Validates that req.body contains valid name and phone strings.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {void} Calls next() or returns 400 Bad Request.
 */
export const validateContactCreation = (req, res, next) => {
  const { name, phone } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return sendError(res, 'Contact name is required and must be a valid text string', 400);
  }

  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return sendError(res, 'Contact phone is required and must be a valid string', 400);
  }

  return next();
};

