// Virtual drill API calls routed through /api/v1/drills.

import { ENDPOINTS } from '../constants/api';
import { apiRequest } from './apiClient';

export const getDrills = () => apiRequest(ENDPOINTS.DRILLS);

export const getDrillById = (drillId) => apiRequest(`${ENDPOINTS.DRILLS}/${drillId}`);

export const submitDrill = (drillId, choices) =>
  apiRequest(`${ENDPOINTS.DRILLS}/${drillId}/submit`, {
    method: 'POST',
    body: { choices },
  });

