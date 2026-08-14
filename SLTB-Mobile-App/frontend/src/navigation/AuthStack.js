/**
 * AuthStack
 * ─────────────────────────────────────────────────────────────────
 * Navigation stack for unauthenticated officers.
 *
 * Screens:
 *   - Login — Officer credentials login (Internal Operations Portal UI)
 *
 * Configuration:
 *   - Custom headers handled inside screens
 *   - Background matching Light Portal Theme (#F8F9FA)
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { APP_ROUTES } from '@constants';
import LoginScreen from '@screens/Login';
import ForgotPasswordScreen from '@screens/ForgotPassword';
import { Colors } from '@theme';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        gestureEnabled: false,   // Prevent back-swipe on auth screens
        contentStyle: { backgroundColor: Colors.portalBg },
      }}
    >
      <Stack.Screen
        name={APP_ROUTES.LOGIN}
        component={LoginScreen}
        options={{ title: 'Officer Login' }}
      />
      <Stack.Screen
        name={APP_ROUTES.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
        options={{ title: 'Forgot Password' }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
