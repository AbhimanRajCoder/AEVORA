// Student bottom tabs (floating pill bar) + native stack navigator in Forest Depths & Pure White.

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FloatingPillTabBar } from '../components/FloatingPillTabBar';
import { MissionBoard } from '../screens/missions/MissionBoard';
import { StudentHomeScreen } from '../screens/student/StudentHomeScreen';
import { ModulesListScreen } from '../screens/student/ModulesListScreen';
import { ModuleDetailScreen } from '../screens/student/ModuleDetailScreen';
import { LessonReaderScreen } from '../screens/student/LessonReaderScreen';
import { QuizScreen } from '../screens/student/QuizScreen';
import { QuizResultScreen } from '../screens/student/QuizResultScreen';
import { DrillsListScreen } from '../screens/student/DrillsListScreen';
import { DrillSimulationScreen } from '../screens/student/DrillSimulationScreen';
import { DrillResultScreen } from '../screens/student/DrillResultScreen';
import { LeaderboardScreen } from '../screens/student/LeaderboardScreen';
import { AlertsScreen } from '../screens/shared/AlertsScreen';
import { EmergencyContactsScreen } from '../screens/shared/EmergencyContactsScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const sharedHeaderOptions = {
  headerStyle: { backgroundColor: COLORS.forestDepths },
  headerTintColor: COLORS.pureWhite,
  headerTitleStyle: { fontWeight: '600', fontSize: 16 },
  headerShadowVisible: false,
};

const StudentTabs = () => (
  <Tab.Navigator
    tabBar={(props) => <FloatingPillTabBar {...props} />}
    screenOptions={sharedHeaderOptions}
  >
    <Tab.Screen
      name="Home"
      component={StudentHomeScreen}
      options={{ headerShown: false, tabBarLabel: 'Home' }}
    />
    <Tab.Screen
      name="Modules"
      component={ModulesListScreen}
      options={{ title: 'Learning Modules', tabBarLabel: 'Learn' }}
    />
    <Tab.Screen
      name="Drills"
      component={DrillsListScreen}
      options={{ title: 'Virtual Drills', tabBarLabel: 'Drills' }}
    />
    <Tab.Screen
      name="Alerts"
      component={AlertsScreen}
      options={{ title: 'Campus Alerts', tabBarLabel: 'Alerts' }}
    />
    <Tab.Screen
      name="Emergency"
      component={EmergencyContactsScreen}
      options={{ title: 'Emergency SOS', tabBarLabel: 'SOS' }}
    />
  </Tab.Navigator>
);

export const StudentNavigator = () => (
  <Stack.Navigator screenOptions={sharedHeaderOptions}>
    <Stack.Screen
      name="StudentTabs"
      component={StudentTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="MissionBoard" component={MissionBoard} options={{ title: "Campus missions" }} />
    <Stack.Screen
      name="ModuleDetail"
      component={ModuleDetailScreen}
      options={({ route }) => ({ title: route.params?.title || 'Module Details' })}
    />
    <Stack.Screen
      name="LessonReader"
      component={LessonReaderScreen}
      options={({ route }) => ({ title: route.params?.lesson?.title || 'Lesson' })}
    />
    <Stack.Screen
      name="Quiz"
      component={QuizScreen}
      options={({ route }) => ({ title: route.params?.moduleTitle ? `${route.params.moduleTitle} Quiz` : 'Module Quiz' })}
    />
    <Stack.Screen
      name="QuizResult"
      component={QuizResultScreen}
      options={{ title: 'Quiz Results' }}
    />
    <Stack.Screen
      name="DrillSimulation"
      component={DrillSimulationScreen}
      options={({ route }) => ({ title: route.params?.title || 'Virtual Drill' })}
    />
    <Stack.Screen
      name="DrillResult"
      component={DrillResultScreen}
      options={{ title: 'Drill Results' }}
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
