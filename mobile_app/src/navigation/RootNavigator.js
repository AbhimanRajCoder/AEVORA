// Root navigator switching between Auth and Student flows based on authentication state.

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/LoadingState';
import { AuthNavigator } from './AuthNavigator';
import { StudentNavigator } from './StudentNavigator';

export const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState dark message="Restoring session..." />;
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? <AuthNavigator /> : <StudentNavigator />}
    </NavigationContainer>
  );
};
