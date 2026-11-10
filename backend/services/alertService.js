// Service handling business logic and Supabase queries for campus alerts.

import { supabase } from '../config/supabase.js';

/**
 * Retrieves all alerts issued for a specific institution ordered newest first.
 * @param {string|null} institutionId - UUID of the student or admin's institution.
 * @returns {Promise<Array>} List of institution alerts.
 */
export const getAlertsByInstitutionId = async (institutionId) => {
  if (!institutionId) {
    return [];
  }

  const { data: alerts, error } = await supabase
    .from('alerts')
    .select('id, institution_id, title, message, severity, created_at')
    .eq('institution_id', institutionId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return alerts || [];
};

/**
 * Creates and publishes a new emergency or drill alert for an institution.
 * @param {string} institutionId - UUID of the admin's institution.
 * @param {object} alertData - Object containing title, message, and severity.
 * @returns {Promise<object>} Created alert record.
 */
export const createAlert = async (institutionId, alertData) => {
  if (!institutionId) {
    const error = new Error('Admin must belong to an institution to create alerts');
    error.statusCode = 400;
    throw error;
  }

  const severityLevel = (alertData.severity || 'info').toLowerCase();

  const { data, error } = await supabase
    .from('alerts')
    .insert({
      institution_id: institutionId,
      title: alertData.title.trim(),
      message: alertData.message.trim(),
      severity: severityLevel,
    })
    .select('id, institution_id, title, message, severity, created_at')
    .single();

  if (error) throw error;
  return data;
};

