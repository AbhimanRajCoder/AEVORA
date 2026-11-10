// Controller handling HTTP requests for institution student leaderboards.

import { getInstitutionLeaderboard } from '../services/leaderboardService.js';
import { sendSuccess } from '../utils/responseHelper.js';

/**
 * Handles GET /api/v1/leaderboard to fetch top ranked students in user's institution.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const getLeaderboard = async (req, res, next) => {
  try {
    const institutionId = req.user.institution_id;
    const currentUserId = req.user.id;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;

    const data = await getInstitutionLeaderboard(institutionId, currentUserId, limit);
    return sendSuccess(res, data, 200);
  } catch (error) {
    return next(error);
  }
};

