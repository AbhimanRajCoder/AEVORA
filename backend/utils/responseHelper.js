// Standard JSON response helper for API endpoints.

/**
 * Sends a successful JSON response with a standard structure.
 * @param {object} res - Express response object.
 * @param {any} data - Payload data to return to the client.
 * @param {number} statusCode - HTTP status code (defaults to 200).
 * @returns {object} Express JSON response.
 */
export const sendSuccess = (res, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    error: null,
  });
};

/**
 * Sends a failed JSON response with a standard structure.
 * @param {object} res - Express response object.
 * @param {string} error - Error message explaining the failure.
 * @param {number} statusCode - HTTP status code (defaults to 500).
 * @returns {object} Express JSON response.
 */
export const sendError = (res, error = 'An unexpected error occurred', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    data: null,
    error,
  });
};

