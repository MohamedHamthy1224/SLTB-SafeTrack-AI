/**
 * SLTB SafeTrack AI — Change Password Screen (Screen 3)
 * ─────────────────────────────────────────────────────────────────
 * Pixel-perfect implementation matching Image 1 mockup.
 *
 * Features:
 *   - Profile Header with Back Action & Right Three-Dot Menu
 *   - Officer Card with Avatar, Online Status, Name, Badge & Orange Role label
 *   - Password Card with Lock Header, Current/New/Confirm inputs, Strength Bar & Requirements Checklist
 *   - Primary "Update Password" action button with lock icon
 *   - Security Tip Banner card
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@theme';
import {
  ProfileHeader,
  OfficerCard,
  PasswordInput,
  PasswordStrengthBar,
  PasswordRequirementItem,
  SecurityTipCard,
  PrimaryButton,
} from '@components/profile';
import { profileData } from '@dummy';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Entrance animation
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

  const handleBack = () => {
    navigation.goBack();
  };

  const handleMenuPress = () => {
    // Menu action
  };

  // Requirement boolean checks
  const isMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(newPassword);

  const validateForm = () => {
    const newErrors = {};
    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!isMinLength || !hasUppercase || !hasLowercase || !hasNumberOrSymbol) {
      newErrors.newPassword = 'Password does not meet requirements';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));

      Toast.show({
        type: 'success',
        text1: 'Password Updated',
        text2: 'Your password has been changed successfully.',
        position: 'top',
      });
      navigation.goBack();
    } catch (_err) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Unable to update password. Please try again.',
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" backgroundColor={Colors.portalBg} />

      {/* ── TOP HEADER ────────────────────────────────────────────── */}
      <ProfileHeader
        title="Change Password"
        onBack={handleBack}
        rightAction={{
          iconName: 'ellipsis-vertical',
          onPress: handleMenuPress,
        }}
      />

      {/* ── MAIN CONTENT AREA ──────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.animatedWrapper,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Officer Profile Card with Orange Role */}
          <OfficerCard
            officerName={profileData.officerName}
            badgeNumber={profileData.badgeNumber}
            role={profileData.role}
            avatarUrl={profileData.avatarUrl}
            isOnline={profileData.isOnline}
          />

          {/* Main Password Card Container */}
          <View style={styles.passwordCard}>
            {/* Top Card Header: Lock Circle Icon & Subtitle */}
            <View style={styles.cardHeaderRow}>
              <View style={styles.lockCircleBadge}>
                <Ionicons name="lock-closed" size={26} color={Colors.orangePrimary} />
              </View>
              <View style={styles.cardHeaderTextSection}>
                <Text style={styles.cardHeaderTitle}>Change Your Password</Text>
                <Text style={styles.cardHeaderSubtitle}>
                  For your security, please use a strong password that you don&apos;t use elsewhere.
                </Text>
              </View>
            </View>

            {/* Input 1: Current Password */}
            <PasswordInput
              label="Current Password"
              placeholder="Enter your current password"
              value={currentPassword}
              onChangeText={(text) => {
                setCurrentPassword(text);
                if (errors.currentPassword) setErrors((prev) => ({ ...prev, currentPassword: null }));
              }}
              error={errors.currentPassword}
            />

            {/* Input 2: New Password */}
            <PasswordInput
              label="New Password"
              placeholder="Enter your new password"
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: null }));
              }}
              error={errors.newPassword}
            />

            {/* Password Strength Progress Bar Indicator */}
            <PasswordStrengthBar password={newPassword} />

            {/* Password Requirements Checklist */}
            <View style={styles.requirementsBox}>
              <Text style={styles.requirementsTitle}>Password must contain:</Text>
              <PasswordRequirementItem label="At least 8 characters" isMet={isMinLength} />
              <PasswordRequirementItem label="One uppercase letter (A-Z)" isMet={hasUppercase} />
              <PasswordRequirementItem label="One lowercase letter (a-z)" isMet={hasLowercase} />
              <PasswordRequirementItem
                label="One number (0-9) or special character (!@#$%^&*)"
                isMet={hasNumberOrSymbol}
              />
            </View>

            {/* Input 3: Confirm New Password */}
            <PasswordInput
              label="Confirm New Password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
              }}
              error={errors.confirmPassword}
            />

            {/* Primary Submit Button: Update Password */}
            <PrimaryButton
              title="Update Password"
              iconName="lock-closed"
              onPress={handleUpdatePassword}
              isLoading={isLoading}
              style={styles.submitBtnMargin}
            />
          </View>

          {/* Security Advice Banner Card */}
          <SecurityTipCard />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.portalBg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing['3xl'],
  },
  animatedWrapper: {
    flex: 1,
  },

  /* Password Card */
  passwordCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  lockCircleBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF0EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  cardHeaderTextSection: {
    flex: 1,
  },
  cardHeaderTitle: {
    fontSize: Typography.fontSize.lg + 1,
    fontWeight: Typography.fontWeight.bold,
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  cardHeaderSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: '#64748B',
    lineHeight: 18,
  },

  /* Requirements Box */
  requirementsBox: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  requirementsTitle: {
    fontSize: Typography.fontSize.xs + 2,
    fontWeight: Typography.fontWeight.bold,
    color: '#0F172A',
    marginBottom: Spacing.xs,
  },

  submitBtnMargin: {
    marginTop: Spacing.xs,
    marginBottom: 0,
  },
});

export default ChangePasswordScreen;
