// Quiz API calls routed through /api/v1/quizzes.

import { ENDPOINTS } from '../constants/api';
import { apiRequest } from './apiClient';

export const getQuiz = (moduleId) => apiRequest(`${ENDPOINTS.QUIZZES}/${moduleId}`);

export const submitQuiz = (moduleId, answers) =>
  apiRequest(`${ENDPOINTS.QUIZZES}/${moduleId}/submit`, {
    method: 'POST',
    body: { answers },
  });

