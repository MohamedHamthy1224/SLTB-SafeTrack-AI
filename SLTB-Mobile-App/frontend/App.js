/**
 * SLTB SafeTrack AI — Mobile Application
 * ═══════════════════════════════════════════════════════════════════
 * Root Application Entry Point
 *
 * Phase 3 — Frontend UI Development (No Backend / No Auth)
 *
 * Entry Point:  expo/AppEntry  (package.json "main")
 *   expo/AppEntry imports this file and calls registerRootComponent(App).
 *   This correctly registers 'main' with AppRegistry before mounting.
 *
 * Startup Flow:
 *   expo/AppEntry
 *     └─ registerRootComponent(App)
 *          └─ AppRegistry.registerComponent('main', App)
 *               └─ AppProvider (Query → Theme → Auth)
 *                    └─ RootNavigator
 *                         └─ NavigationContainer
 *                              └─ isLoading=false, isAuthenticated=false
 *                                   └─ AuthStack → LoginScreen ✓
 *
 * NOTES:
 *   - react-native-gesture-handler: NOT imported at top-level.
 *     Gesture Handler 2.28 does NOT require a top-level import for navigation.
 *     It will be restored in Phase 4 if gesture-based interactions are needed.
 *   - react-native-reanimated/plugin: commented out in babel.config.js for Phase 3.
 *     worklets 0.5.1 is a valid peer for reanimated 4.1.7 (peer range: 0.5 - 0.8).
 *     Plugin will be restored in Phase 4 when animations are added.
 * ═══════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { StyleSheet, View, LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Silence non-critical web-specific deprecation warnings in React Native Web
LogBox.ignoreLogs([
  '"shadow*" style props are deprecated',
  'props.pointerEvents is deprecated',
  'Animated: `useNativeDriver` is not supported',
]);

import AppProvider from './src/providers/AppProvider';
import { RootNavigator } from './src/navigation';
import { Colors } from './src/theme';

export default function App() {
  return (
    <View style={styles.root}>
      <StatusBar style="dark" backgroundColor={Colors.portalBg} />
      <AppProvider>
        <RootNavigator />
      </AppProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.portalBg,
  },
});