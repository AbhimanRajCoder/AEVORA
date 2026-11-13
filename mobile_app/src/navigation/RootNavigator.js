// Root navigator switching between Auth and Student flows based on authentication state.

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/LoadingState';
import { AuthNavigator } from './AuthNavigator';
import { StudentNavigator } from './StudentNavigator';

import { CampusDashboard } from '../screens/admin/CampusDashboard';
import { ROLES } from '../constants/roles';

export const RootNavigator = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingState dark message="Restoring session..." />;
  }

  if (user?.role === ROLES.ADMIN) return <CampusDashboard />;

  return (
    <NavigationContainer>
      {!isAuthenticated ? <AuthNavigator /> : <StudentNavigator />}
    </NavigationContainer>
  );
};
