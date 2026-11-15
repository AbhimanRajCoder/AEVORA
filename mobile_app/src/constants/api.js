// API base URL and backend route constants read directly from mobile_app/.env (EXPO_PUBLIC_API_BASE_URL).

const FALLBACK_API_BASE_URL = 'https://aevora-qgyd.onrender.com/api/v1';

const rawApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || FALLBACK_API_BASE_URL;

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, '');

export const ENDPOINTS = {
  HEALTH: '/health',
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    GOOGLE_START: '/auth/google/start',
    GOOGLE_STATUS: '/auth/google/status',
    GOOGLE_TOKEN: '/auth/google',
  },
  INSTITUTIONS: '/institutions',
  MODULES: '/modules',
  LESSONS: '/lessons',
  QUIZZES: '/quizzes',
  DRILLS: '/drills',
  LEADERBOARD: '/leaderboard',
  CONTACTS: '/contacts',
  ALERTS: '/alerts',
};
