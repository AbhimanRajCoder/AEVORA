// Request parameter validation middleware for UUID path parameters.

import { sendError } from '../utils/responseHelper.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates that the 'id' parameter in req.params is a valid UUID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {void} Calls next() or returns 400 Bad Request.
 */
export const validateUuidParam = (req, res, next) => {
  const { id } = req.params;

  if (!id || !UUID_REGEX.test(id)) {
    return sendError(res, 'Invalid ID format: must be a valid UUID', 400);
  }

  return next();
};
