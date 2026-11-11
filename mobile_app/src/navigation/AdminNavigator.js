// Administrator bottom tabs using the floating pill bar in Forest Depths & Pure White.

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FloatingPillTabBar } from '../components/FloatingPillTabBar';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { AlertsScreen } from '../screens/shared/AlertsScreen';
import { EmergencyContactsScreen } from '../screens/shared/EmergencyContactsScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();

export const AdminNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <FloatingPillTabBar {...props} />}
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.forestDepths },
      headerTintColor: COLORS.pureWhite,
      headerTitleStyle: { fontWeight: '600', fontSize: 16 },
      headerShadowVisible: false,
    }}
  >
    <Tab.Screen
      name="Dashboard"
      component={AdminDashboardScreen}
      options={{ headerShown: false, tabBarLabel: 'Overview' }}
    />
    <Tab.Screen name="Alerts" component={AlertsScreen} options={{ title: 'Campus Alerts' }} />
    <Tab.Screen
      name="Contacts"
      component={EmergencyContactsScreen}
      options={{ title: 'Contacts' }}
    />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
  </Tab.Navigator>
);
