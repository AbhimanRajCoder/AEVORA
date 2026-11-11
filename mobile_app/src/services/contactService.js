// Emergency contacts API calls routed through /api/v1/contacts.

import { ENDPOINTS } from '../constants/api';
import { apiRequest } from './apiClient';

export const getContacts = () => apiRequest(ENDPOINTS.CONTACTS);

export const createContact = ({ name, phone }) =>
  apiRequest(ENDPOINTS.CONTACTS, {
    method: 'POST',
    body: { name, phone },
  });

