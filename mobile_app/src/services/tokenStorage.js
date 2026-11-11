// Secure token storage using expo-secure-store on native and localStorage fallback on web.

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'aevora_access_token';
const REFRESH_TOKEN_KEY = 'aevora_refresh_token';

const isWeb = Platform.OS === 'web';

const setItem = async (key, value) => {
  if (isWeb && typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
};

const getItem = async (key) => {
  if (isWeb && typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
};

const deleteItem = async (key) => {
  if (isWeb && typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
};

/**
 * Persists access and refresh tokens returned by the backend.
 */
export const saveTokens = async (accessToken, refreshToken) => {
  if (accessToken) await setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) await setItem(REFRESH_TOKEN_KEY, refreshToken);
};

/**
 * Reads stored access and refresh tokens.
 */
export const getTokens = async () => {
  const [accessToken, refreshToken] = await Promise.all([
    getItem(ACCESS_TOKEN_KEY),
    getItem(REFRESH_TOKEN_KEY),
  ]);
  return { accessToken, refreshToken };
};

/**
 * Removes stored auth tokens on logout or expired session.
 */
export const clearTokens = async () => {
  await Promise.all([deleteItem(ACCESS_TOKEN_KEY), deleteItem(REFRESH_TOKEN_KEY)]);
};

