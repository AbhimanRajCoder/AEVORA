// Controller handling HTTP requests for campus alerts.

import { getAlertsByInstitutionId, createAlert as createAlertService } from '../services/alertService.js';
import { sendSuccess } from '../utils/responseHelper.js';

/**
 * Handles GET /api/v1/alerts to fetch all alerts for the user's institution.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const getAlerts = async (req, res, next) => {
  try {
    const alerts = await getAlertsByInstitutionId(req.user.institution_id);
    return sendSuccess(res, alerts, 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * Handles POST /api/v1/alerts to create an alert for the admin's institution.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const createAlert = async (req, res, next) => {
  try {
    const newAlert = await createAlertService(req.user.institution_id, req.body);
    return sendSuccess(res, newAlert, 201);
  } catch (error) {
    return next(error);
  }
};

