// Request body validation middleware for virtual drill decision submissions.

import { sendError } from '../utils/responseHelper.js';

/**
 * Validates that req.body contains student choices for drill scenario steps.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {void} Calls next() or returns 400 Bad Request.
 */
export const validateDrillSubmission = (req, res, next) => {
  const { choices } = req.body;

  if (!choices) {
    return sendError(res, 'Choices payload is required', 400);
  }

  const isArray = Array.isArray(choices) && choices.length > 0;
  const isObject = typeof choices === 'object' && !Array.isArray(choices) && Object.keys(choices).length > 0;

  if (!isArray && !isObject) {
    return sendError(res, 'Choices must be a non-empty array or step-to-action object', 400);
  }

  return next();
};

