// Admin dashboard and backend health API calls.

import { ENDPOINTS } from '../constants/api';
import { apiRequest } from './apiClient';

export const getDashboardStats = () => apiRequest(ENDPOINTS.DASHBOARD);

export const checkHealth = () => apiRequest(ENDPOINTS.HEALTH, { skipAuth: true });

