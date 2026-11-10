// Controller handling HTTP requests for learning modules.

import { getAllModules, getModuleById } from '../services/moduleService.js';
import { sendSuccess } from '../utils/responseHelper.js';

/**
 * Handles GET /api/v1/modules to retrieve all disaster learning modules.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const getModules = async (req, res, next) => {
  try {
    const modules = await getAllModules(req.user.id);
    return sendSuccess(res, modules, 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * Handles GET /api/v1/modules/:id to retrieve single module details and lessons.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const getModuleDetails = async (req, res, next) => {
  try {
    const moduleData = await getModuleById(req.params.id, req.user.id);
    return sendSuccess(res, moduleData, 200);
  } catch (error) {
    return next(error);
  }
};

