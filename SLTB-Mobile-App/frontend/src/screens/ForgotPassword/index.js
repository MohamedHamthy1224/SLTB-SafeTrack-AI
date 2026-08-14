/**
 * SLTB SafeTrack AI — Officer Forgot Password Screen
 * ─────────────────────────────────────────────────────────────────
 * Pixel-perfect implementation of the Forgot Password Screen matching the design system.
 *
 * Features:
 *   - Responsive Android & iOS layout
 *   - SafeAreaView, KeyboardAvoidingView, ScrollView integration
 *   - Entrance fade-in & slide-up card animations
 *   - Circular Orange Badge & Portal Header
 *   - Forgot Password Card with React Hook Form validation
 *   - Security badge ("Secure • Encrypted • Confidential")
 *   - Department Branding & Version Footer (Version 1.4.3)
 */

import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing } from '@theme';
import { APP_ROUTES } from '@constants';
import {
  PortalHeader,
  ForgotPasswordCard,
  EncryptedSessionBadge,
  PortalFooter,
} from '@components/authentication';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleBackToLogin = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate(APP_ROUTES.LOGIN);
    }
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
          <Animated.View
            style={[
              styles.innerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Top Logo & Header */}
            <PortalHeader />

            {/* Forgot Password Form Card */}
            <ForgotPasswordCard onBackToLogin={handleBackToLogin} />

            {/* Confidential Security Indicator Badge */}
            <EncryptedSessionBadge
              text="Secure • Encrypted • Confidential"
              iconName="lock-closed-outline"
            />

            {/* Department & Version Footer */}
            <PortalFooter />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.portalBg,
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
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
});

export default ForgotPasswordScreen;
