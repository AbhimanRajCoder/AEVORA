// Request parameter validation middleware for UUID path parameters.

import { sendError } from '../utils/responseHelper.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates that a route param (defaults to 'id') is a valid UUID format.
 * Can be used as middleware directly or as a middleware factory with a param name.
 * @param {string|object} paramNameOrReq - Parameter name or Express request object.
 * @returns {function|void} Express middleware function or execution result.
 */
export const validateUuidParam = (paramNameOrReq = 'id', res, next) => {
  if (typeof paramNameOrReq === 'object' && paramNameOrReq !== null && paramNameOrReq.params) {
    const req = paramNameOrReq;
    const value = req.params.id;

    if (!value || !UUID_REGEX.test(value)) {
      return sendError(res, 'Invalid ID format: must be a valid UUID', 400);
    }
    return next();
  }

  const paramName = typeof paramNameOrReq === 'string' ? paramNameOrReq : 'id';
  return (req, res, next) => {
    const value = req.params[paramName];
    if (!value || !UUID_REGEX.test(value)) {
      return sendError(res, `Invalid ${paramName} format: must be a valid UUID`, 400);
    }
    return next();
  };
};

