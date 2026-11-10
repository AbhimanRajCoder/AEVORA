// Service handling business logic and Supabase queries for emergency contacts.

import { supabase } from '../config/supabase.js';

/**
 * Retrieves national emergency contacts and local institution contacts.
 * @param {string|null} institutionId - UUID of the student or admin's institution.
 * @returns {Promise<object>} Grouped emergency contacts.
 */
export const getEmergencyContacts = async (institutionId) => {
  let query = supabase
    .from('emergency_contacts')
    .select('id, name, phone, institution_id, created_at');

  if (institutionId) {
    query = query.or(`institution_id.is.null,institution_id.eq.${institutionId}`);
  } else {
    query = query.is('institution_id', null);
  }

  const { data, error } = await query.order('created_at', { ascending: true });
  if (error) throw error;

  const all = data || [];
  const national = all.filter((c) => c.institution_id === null);
  const local = all.filter((c) => c.institution_id !== null);

  return {
    total: all.length,
    national_contacts: national,
    local_contacts: local,
    contacts: all,
  };
};

/**
 * Adds a new local emergency contact for the admin's institution.
 * @param {string} institutionId - UUID of the admin's institution.
 * @param {object} contactData - Object with name and phone.
 * @returns {Promise<object>} The newly created emergency contact record.
 */
export const createLocalContact = async (institutionId, contactData) => {
  if (!institutionId) {
    const error = new Error('Admin must belong to an institution to add a local contact');
    error.statusCode = 400;
    throw error;
  }

  const { data, error } = await supabase
    .from('emergency_contacts')
    .insert({
      institution_id: institutionId,
      name: contactData.name.trim(),
      phone: contactData.phone.trim(),
    })
    .select('id, name, phone, institution_id, created_at')
    .single();

  if (error) throw error;
  return data;
};

