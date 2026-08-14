/**
 * AppStack
 * ─────────────────────────────────────────────────────────────────
 * Navigation stack for authenticated officers.
 * Consists of a Bottom Tab Navigator with modal overlays.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { APP_ROUTES } from '@constants';
import { Colors } from '@theme';

import DashboardScreen from '@screens/Dashboard';
import AlertsDashboardScreen from '@screens/Alerts';
import AlertDetailsScreen from '@screens/AlertDetails';
import HistoryScreen from '@screens/History';
import ProfileScreen from '@screens/Profile';
import EditProfileScreen from '@screens/EditProfile';
import ChangePasswordScreen from '@screens/ChangePassword';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const tabIcon = (name) => ({ color, size }) => (
  <Ionicons name={name} color={color} size={size} />
);

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.orangePrimary,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name={APP_ROUTES.DASHBOARD}
        component={DashboardScreen}
        options={{
          title: 'Home',
          tabBarIcon: tabIcon('home'),
        }}
      />
      <Tab.Screen
        name={APP_ROUTES.ALERTS}
        component={AlertsDashboardScreen}
        options={{
          title: 'Alerts',
          tabBarIcon: tabIcon('notifications'),
          tabBarBadge: 3,
          tabBarBadgeStyle: {
            backgroundColor: '#EF4444',
            color: Colors.white,
            fontSize: 10,
            fontWeight: 'bold',
          },
        }}
      />
      <Tab.Screen
        name={APP_ROUTES.HISTORY}
        component={HistoryScreen}
        options={{
          title: 'History',
          tabBarIcon: tabIcon('time'),
        }}
      />
      <Tab.Screen
        name={APP_ROUTES.PROFILE}
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: tabIcon('person-outline'),
        }}
      />
    </Tab.Navigator>
  );
};

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen
        name={APP_ROUTES.ALERT_DETAILS}
        component={AlertDetailsScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name={APP_ROUTES.EDIT_PROFILE}
        component={EditProfileScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name={APP_ROUTES.CHANGE_PASSWORD}
        component={ChangePasswordScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
