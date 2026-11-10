// Controller handling HTTP requests for virtual drills and decision grading.

import { getDrillScenarios, getDrillScenarioById, submitDrillChoices } from '../services/drillService.js';
import { sendSuccess } from '../utils/responseHelper.js';

/**
 * Handles GET /api/v1/drills to list all virtual drill scenarios.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const getDrills = async (req, res, next) => {
  try {
    const drills = await getDrillScenarios();
    return sendSuccess(res, drills, 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * Handles GET /api/v1/drills/:id to get a single drill scenario.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const getDrill = async (req, res, next) => {
  try {
    const drill = await getDrillScenarioById(req.params.id);
    return sendSuccess(res, drill, 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * Handles POST /api/v1/drills/:id/submit to grade student choices.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const submitDrill = async (req, res, next) => {
  try {
    const result = await submitDrillChoices(req.params.id, req.user.id, req.body.choices);
    return sendSuccess(res, result, 200);
  } catch (error) {
    return next(error);
  }
};

