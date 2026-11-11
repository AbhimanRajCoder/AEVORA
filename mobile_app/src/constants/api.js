// API base URL and backend route constants read directly from mobile_app/.env (EXPO_PUBLIC_API_BASE_URL).

const rawApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!rawApiBaseUrl) {
  throw new Error(
    'Missing EXPO_PUBLIC_API_BASE_URL in mobile_app/.env. Set it to your backend URL (e.g. http://<LAN_IP>:5000/api/v1).'
  );
}

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
