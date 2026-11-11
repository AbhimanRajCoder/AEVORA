// API base URL and backend route constants (all frontend calls route to Express backend only).

import { Platform } from 'react-native';

const DEFAULT_LOCALHOST = Platform.OS === 'android'
  ? 'http://10.0.2.2:5000/api/v1'
  : 'http://localhost:5000/api/v1';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_LOCALHOST;

export const ENDPOINTS = {
  HEALTH: '/health',
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  INSTITUTIONS: '/institutions',
  MODULES: '/modules',
  LESSONS: '/lessons',
  QUIZZES: '/quizzes',
  DRILLS: '/drills',
  LEADERBOARD: '/leaderboard',
  CONTACTS: '/contacts',
  ALERTS: '/alerts',
  DASHBOARD: '/dashboard',
};

