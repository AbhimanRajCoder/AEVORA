// Campus alerts API calls routed through /api/v1/alerts.

import { ENDPOINTS } from '../constants/api';
import { apiRequest } from './apiClient';

export const getAlerts = () => apiRequest(ENDPOINTS.ALERTS);
