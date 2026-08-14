/**
 * SLTB SafeTrack AI — Officer Login Screen (UI Development Only)
 * ─────────────────────────────────────────────────────────────────
 * Pixel-perfect implementation of the Internal Operations Portal Officer Login.
 *
 * Features:
 *   - Responsive Android & iOS layout
 *   - SafeAreaView, KeyboardAvoidingView, ScrollView integration
 *   - Circular Orange Badge & Portal Header
 *   - White Login Card with top orange accent bar
 *   - Email & Password fields with eye toggle & validation feedback
 *   - 256-bit Encrypted Session Pill Badge
 *   - Department Branding & Version Footer
 */

import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing } from '@theme';
import { APP_ROUTES } from '@constants';
import {
  PortalHeader,
  LoginCard,
  EncryptedSessionBadge,
  PortalFooter,
} from '@components/authentication';

const LoginScreen = () => {
  const navigation = useNavigation();

  const handleForgotPassword = () => {
    navigation.navigate(APP_ROUTES.FORGOT_PASSWORD);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar style="dark" backgroundColor={Colors.portalBg} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.innerContainer}>
            {/* Top Logo & Header */}
            <PortalHeader />

            {/* Main Officer Login Card */}
            <LoginCard onForgotPassword={handleForgotPassword} />

            {/* Encrypted Session Indicator Badge */}
            <EncryptedSessionBadge />

            {/* Department & Version Footer */}
            <PortalFooter />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.portalBg, // Clean light off-white background (#F8F9FA)
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  innerContainer: {
    flex: 1,
    maxWidth: 480, // Constrain max width for tablets & web preview
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
});

export default LoginScreen;
