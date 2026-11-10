// Authentication middleware verifying Bearer tokens and loading user profile data.

import { supabase } from '../config/supabase.js';
import { sendError } from '../utils/responseHelper.js';

/**
 * Middleware that authenticates incoming requests using Supabase Auth.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>} Calls next() or returns 401 error.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication token required', 401);
    }

    const token = authHeader.split(' ')[1];
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData.user) {
      return sendError(res, 'Invalid or expired token', 401);
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, institution_id, full_name, points')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      return sendError(res, 'User profile not found', 401);
    }

    req.user = {
      id: authData.user.id,
      email: authData.user.email,
      role: profile.role,
      institution_id: profile.institution_id,
      full_name: profile.full_name,
      points: profile.points,
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

