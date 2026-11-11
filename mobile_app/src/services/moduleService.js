// Module and lesson API calls routed through /api/v1/modules and /api/v1/lessons.

import { ENDPOINTS } from '../constants/api';
import { apiRequest } from './apiClient';

export const getModules = () => apiRequest(ENDPOINTS.MODULES);

export const getModuleById = (moduleId) => apiRequest(`${ENDPOINTS.MODULES}/${moduleId}`);

export const completeLesson = (lessonId) =>
  apiRequest(`${ENDPOINTS.LESSONS}/${lessonId}/complete`, { method: 'POST' });

