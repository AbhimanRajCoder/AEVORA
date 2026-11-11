// Bottom tab navigator for authenticated administrator users.

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { AlertsScreen } from '../screens/shared/AlertsScreen';
import { EmergencyContactsScreen } from '../screens/shared/EmergencyContactsScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();

export const AdminNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textMuted,
    }}
  >
    <Tab.Screen
      name="Dashboard"
      component={AdminDashboardScreen}
      options={{ title: 'Dashboard' }}
    />
    <Tab.Screen name="Alerts" component={AlertsScreen} options={{ title: 'Alerts' }} />
    <Tab.Screen
      name="Contacts"
      component={EmergencyContactsScreen}
      options={{ title: 'Contacts' }}
    />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
  </Tab.Navigator>
);

