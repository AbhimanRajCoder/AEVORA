// Campus alerts API calls routed through /api/v1/alerts.

import { ENDPOINTS } from '../constants/api';
import { apiRequest } from './apiClient';

export const getAlerts = () => apiRequest(ENDPOINTS.ALERTS);

export const createAlert = ({ title, message, severity = 'info' }) =>
  apiRequest(ENDPOINTS.ALERTS, {
    method: 'POST',
    body: { title, message, severity },
  });

