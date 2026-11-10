// Controller handling HTTP requests for national and local emergency contacts.

import { getEmergencyContacts, createLocalContact } from '../services/contactService.js';
import { sendSuccess } from '../utils/responseHelper.js';

/**
 * Handles GET /api/v1/contacts to list emergency contact numbers.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const getContacts = async (req, res, next) => {
  try {
    const contacts = await getEmergencyContacts(req.user.institution_id);
    return sendSuccess(res, contacts, 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * Handles POST /api/v1/contacts to add a local emergency contact (Admin only).
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const createContact = async (req, res, next) => {
  try {
    const newContact = await createLocalContact(req.user.institution_id, req.body);
    return sendSuccess(res, newContact, 201);
  } catch (error) {
    return next(error);
  }
};

