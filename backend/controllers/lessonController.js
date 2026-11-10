// Controller handling HTTP requests for lessons and student completion.

import { markLessonComplete } from '../services/lessonService.js';
import { sendSuccess } from '../utils/responseHelper.js';

/**
 * Handles POST /api/v1/lessons/:id/complete to record student lesson completion.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const completeLesson = async (req, res, next) => {
  try {
    const result = await markLessonComplete(req.params.id, req.user.id);
    return sendSuccess(res, result, 201);
  } catch (error) {
    return next(error);
  }
};

