// Global authentication context managing session restoration and backend-only auth actions.

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';
import { getTokens, clearTokens } from '../services/tokenStorage';
import { setUnauthorizedHandler } from '../services/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleForcedLogout = useCallback(async () => {
    await clearTokens();
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(handleForcedLogout);
  }, [handleForcedLogout]);

  const restoreSession = useCallback(async () => {
    try {
      const { accessToken } = await getTokens();
      if (!accessToken) {
        setUser(null);
        return;
      }
      const profile = await authService.getMe();
      setUser(profile);
    } catch {
      await clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const signIn = useCallback(async (credentials) => {
    const authData = await authService.login(credentials);
    setUser(authData.user);
    return authData.user;
  }, []);

  const signUp = useCallback(async (payload) => {
    const authData = await authService.signup(payload);
    setUser(authData.user);
    return authData.user;
  }, []);

  const signOut = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const profile = await authService.getMe();
    setUser(profile);
    return profile;
  }, []);

  const completeGoogleSignIn = useCallback(async (session) => {
    await authService.persistGoogleSession(session);
    setUser(session.user);
    return session.user;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshUser,
        completeGoogleSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};
