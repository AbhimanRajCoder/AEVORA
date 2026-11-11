// Backend health check API call.

import { ENDPOINTS } from '../constants/api';
import { apiRequest } from './apiClient';

export const checkHealth = () => apiRequest(ENDPOINTS.HEALTH, { skipAuth: true });
