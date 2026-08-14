/**
 * RootNavigator
 * ─────────────────────────────────────────────────────────────────
 * The top-level navigator that decides whether to show the
 * AuthStack (unauthenticated) or AppStack (authenticated).
 *
 * Flow:
 *   1. While isLoading=true  → Show splash/loading state
 *   2. isAuthenticated=false → Show AuthStack (Login)
 *   3. isAuthenticated=true  → Show AppStack (Dashboard + Tabs)
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthContext } from '@contexts';
import { navigationRef } from './navigationRef';
import { Colors } from '@theme';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

// Navigation Theme for Light Portal UI
const NavigationTheme = {
  dark: false,
  colors: {
    primary:      Colors.orangePrimary,
    background:   Colors.portalBg,
    card:         Colors.white,
    text:         Colors.textDark,
    border:       Colors.border,
    notification: Colors.orangePrimary,
  },
};

const LoadingScreen = () => (
  <View style={styles.loading}>
    <ActivityIndicator size="large" color={Colors.orangePrimary} />
  </View>
);

const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuthContext();

  return (
    <NavigationContainer ref={navigationRef} theme={NavigationTheme}>
      {isLoading ? (
        <LoadingScreen />
      ) : isAuthenticated ? (
        <AppStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: Colors.portalBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RootNavigator;
