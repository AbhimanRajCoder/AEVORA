// Controller handling HTTP requests for the administrative preparedness dashboard.

import { getAdminDashboardStats } from '../services/dashboardService.js';
import { sendSuccess } from '../utils/responseHelper.js';

/**
 * Handles GET /api/v1/dashboard to compute institution analytics and preparedness score.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await getAdminDashboardStats(req.user.institution_id);
    return sendSuccess(res, stats, 200);
  } catch (error) {
    return next(error);
  }
};

