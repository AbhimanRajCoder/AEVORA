// Bottom tab + stack navigator for authenticated student users.

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StudentHomeScreen } from '../screens/student/StudentHomeScreen';
import { ModulesListScreen } from '../screens/student/ModulesListScreen';
import { DrillsListScreen } from '../screens/student/DrillsListScreen';
import { LeaderboardScreen } from '../screens/student/LeaderboardScreen';
import { AlertsScreen } from '../screens/shared/AlertsScreen';
import { EmergencyContactsScreen } from '../screens/shared/EmergencyContactsScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const StudentTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textMuted,
    }}
  >
    <Tab.Screen name="Home" component={StudentHomeScreen} options={{ title: 'AEVORA' }} />
    <Tab.Screen name="Modules" component={ModulesListScreen} options={{ title: 'Modules' }} />
    <Tab.Screen name="Drills" component={DrillsListScreen} options={{ title: 'Drills' }} />
    <Tab.Screen name="Alerts" component={AlertsScreen} options={{ title: 'Alerts' }} />
    <Tab.Screen name="Emergency" component={EmergencyContactsScreen} options={{ title: 'SOS' }} />
  </Tab.Navigator>
);

export const StudentNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="StudentTabs"
      component={StudentTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Leaderboard"
      component={LeaderboardScreen}
      options={{ title: 'Campus Leaderboard' }}
    />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'My Profile' }}
    />
  </Stack.Navigator>
);

