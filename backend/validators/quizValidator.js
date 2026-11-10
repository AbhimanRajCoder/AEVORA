// Request body validation middleware for quiz answer submissions.

import { sendError } from '../utils/responseHelper.js';

/**
 * Validates that req.body contains a non-empty answers array or dictionary.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {void} Calls next() or returns 400 Bad Request.
 */
export const validateQuizSubmission = (req, res, next) => {
  const { answers } = req.body;

  if (!answers) {
    return sendError(res, 'Answers payload is required', 400);
  }

  const isArray = Array.isArray(answers) && answers.length > 0;
  const isObject = typeof answers === 'object' && !Array.isArray(answers) && Object.keys(answers).length > 0;

  if (!isArray && !isObject) {
    return sendError(res, 'Answers must be a non-empty array or key-value object', 400);
  }

  return next();
};

