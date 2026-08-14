/**
 * ForgotPasswordCard Component
 * ─────────────────────────────────────────────────────────────────
 * Pixel-perfect implementation of the Forgot Password Card matching the SLTB design system.
 *
 * Features:
 *   - Back Arrow to navigate back to Login
 *   - Centered Orange Mail + Lock Badge Icon
 *   - Title ("Forgot Password?") & Subtitle
 *   - Officer Email field with React Hook Form validation
 *   - Primary "Send Reset Link >" CTA button
 *   - "OR" Divider line
 *   - Secondary "← Back to Login" outlined button
 *   - TODO marker for Phase 2 Laravel API integration
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@theme';
import AuthInput from './AuthInput';

const ForgotPasswordCard = ({ onBackToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (_data) => {
    setIsLoading(true);

    try {
      // ─────────────────────────────────────────────────────────────
      // TODO: Phase 2 — Axios API call to Laravel backend endpoint:
      //   const response = await authService.forgotPassword({ email: _data.email });
      // ─────────────────────────────────────────────────────────────

      // Simulate subtle network delay for UI feedback
      await new Promise((resolve) => setTimeout(resolve, 600));

      Toast.show({
        type: 'success',
        text1: 'Reset Link Sent',
        text2: 'Password reset feature will be connected in Phase 2.',
        position: 'top',
        visibilityTime: 4000,
      });
    } catch (_err) {
      Toast.show({
        type: 'error',
        text1: 'Request Failed',
        text2: 'Unable to send reset link. Please try again.',
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      {/* Top Accent Orange Bar */}
      <View style={styles.topAccentBar} />

      <View style={styles.cardContent}>
        {/* Top Header Row — Back Arrow Icon */}
        <View style={styles.topHeaderRow}>
          <TouchableOpacity
            style={styles.backIconButton}
            onPress={onBackToLogin}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={22} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Centered Orange Mail + Lock Badge Icon */}
        <View style={styles.iconCenterWrapper}>
          <View style={styles.mailBadgeBox}>
            <Ionicons
              name="mail-outline"
              size={52}
              color={Colors.orangePrimary}
            />
            <View style={styles.lockOverlayDot}>
              <Ionicons
                name="lock-closed"
                size={13}
                color={Colors.orangePrimary}
              />
            </View>
          </View>
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          {"No worries! Enter your email address and we'll send you a secure link to reset your password."}
        </Text>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Officer Email Field with React Hook Form */}
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Officer email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                label="OFFICER EMAIL"
                placeholder="e.g. zane@gmail.com"
                leftIconName="person-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />

          {/* Primary Submit Button — Send Reset Link */}
          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.primaryButtonText}>Send Reset Link</Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={Colors.white}
                  style={styles.chevronIcon}
                />
              </View>
            )}
          </TouchableOpacity>

          {/* OR Divider Line */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Secondary Button — Back to Login */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onBackToLogin}
            activeOpacity={0.75}
          >
            <View style={styles.buttonContent}>
              <Ionicons
                name="arrow-back"
                size={18}
                color={Colors.orangePrimary}
                style={styles.leftArrowIcon}
              />
              <Text style={styles.secondaryButtonText}>Back to Login</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius['3xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.card,
    marginBottom: Spacing.xs,
  },
  topAccentBar: {
    height: 5,
    backgroundColor: Colors.orangePrimary,
    width: '100%',
  },
  cardContent: {
    padding: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: Spacing.xs,
  },
  backIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
  },

  /* Icon Badge */
  iconCenterWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xs,
  },
  mailBadgeBox: {
    position: 'relative',
    width: 72,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockOverlayDot: {
    position: 'absolute',
    bottom: 2,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.orangePrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.xs,
  },

  /* Typography */
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: '#0F172A',
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs - 2,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: Typography.fontSize.base * 1.4,
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.xl,
  },

  formContainer: {
    marginTop: Spacing.xs,
  },

  /* Primary Button */
  primaryButton: {
    backgroundColor: Colors.orangePrimary,
    borderRadius: BorderRadius.xl,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
    shadowColor: Colors.orangePrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: Typography.fontSize.base + 2,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginRight: Spacing.xs,
  },
  chevronIcon: {
    marginTop: 1,
  },

  /* Divider */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: Typography.fontWeight.bold,
    color: '#9CA3AF',
    marginHorizontal: Spacing.md,
    letterSpacing: 0.5,
  },

  /* Secondary Button */
  secondaryButton: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.orangePrimary,
  },
  secondaryButtonText: {
    fontSize: Typography.fontSize.base + 1,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.orangePrimary,
  },
  leftArrowIcon: {
    marginRight: Spacing.xs + 2,
    marginTop: 1,
  },
});

export default ForgotPasswordCard;
