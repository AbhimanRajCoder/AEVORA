// Leaderboard API calls routed through /api/v1/leaderboard.

import { ENDPOINTS } from '../constants/api';
import { apiRequest } from './apiClient';

export const getLeaderboard = (limit = 20) =>
  apiRequest(`${ENDPOINTS.LEADERBOARD}?limit=${limit}`);

