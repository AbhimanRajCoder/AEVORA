// Controller handling HTTP requests for quizzes and answers grading.

import { getQuizByModuleId, submitQuizAnswers } from '../services/quizService.js';
import { sendSuccess } from '../utils/responseHelper.js';

/**
 * Handles GET /api/v1/quizzes/:moduleId to retrieve questions for a quiz.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const getQuiz = async (req, res, next) => {
  try {
    const quiz = await getQuizByModuleId(req.params.moduleId);
    return sendSuccess(res, quiz, 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * Handles POST /api/v1/quizzes/:moduleId/submit to grade student answers.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const submitQuiz = async (req, res, next) => {
  try {
    const result = await submitQuizAnswers(req.params.moduleId, req.user.id, req.body.answers);
    return sendSuccess(res, result, 200);
  } catch (error) {
    return next(error);
  }
};

