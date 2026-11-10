// Simple server logger for operational and error messages.

/**
 * Logs informational messages to standard output.
 * @param {string} message - Message text to log.
 */
export const logInfo = (message) => {
  process.stdout.write(`[INFO] ${new Date().toISOString()} - ${message}\n`);
};

/**
 * Logs error messages to standard error.
 * @param {string} message - Error details to log.
 */
export const logError = (message) => {
  process.stderr.write(`[ERROR] ${new Date().toISOString()} - ${message}\n`);
};

