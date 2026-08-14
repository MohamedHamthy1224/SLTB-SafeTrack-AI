/**
 * LoginCard Component
 * ─────────────────────────────────────────────────────────────────
 * The primary white form card for Officer Login connected to Laravel backend.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@theme';
import { useAuthContext } from '@contexts';
import AuthInput from './AuthInput';

const LoginCard = ({ onForgotPassword }) => {
  const { login } = useAuthContext();

  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!loginInput.trim()) {
      newErrors.loginInput = 'Officer email or username is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginPress = async () => {
    setGeneralError(null);
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await login({
        login: loginInput.trim(),
        password: password,
      });
    } catch (err) {
      const msg = err.message || 'Unable to connect to server';
      if (msg.includes('Password')) {
        setErrors((prev) => ({ ...prev, password: 'Incorrect Password' }));
      } else if (msg.includes('Email') || msg.includes('Username')) {
        setErrors((prev) => ({ ...prev, loginInput: 'Invalid Email or Username' }));
      }
      setGeneralError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      {/* Top Accent Orange Bar */}
      <View style={styles.topAccentBar} />

      <View style={styles.cardContent}>
        {/* Card Header */}
        <Text style={styles.title}>Officer Login</Text>
        <Text style={styles.subtitle}>
          Please enter your credentials to proceed.
        </Text>

        {/* Form Inputs */}
        <View style={styles.formContainer}>
          {/* Email / Username Input */}
          <AuthInput
            label="OFFICER EMAIL OR USERNAME"
            placeholder="e.g. officer001 or officer001@safetrackai.com"
            leftIconName="person-outline"
            value={loginInput}
            onChangeText={(text) => {
              setLoginInput(text);
              if (errors.loginInput) setErrors((prev) => ({ ...prev, loginInput: null }));
              if (generalError) setGeneralError(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.loginInput}
          />

          {/* Password Input */}
          <AuthInput
            label="PASSWORD"
            rightLabelAction={{
              title: 'Forgot Password?',
              onPress: onForgotPassword,
            }}
            placeholder="Enter Secure Password"
            leftIconName="lock-closed-outline"
            isPassword
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              if (generalError) setGeneralError(null);
            }}
            error={errors.password}
          />

          {/* Error Feedback Message Box */}
          {generalError ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={20} color={Colors.error} />
              <Text style={styles.errorBoxText}>{generalError}</Text>
            </View>
          ) : null}

          {/* Primary Orange Submit Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLoginPress}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Login to System</Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={Colors.white}
                  style={styles.chevronIcon}
                />
              </View>
            )}
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
    paddingTop: Spacing.xl + 4,
  },
  title: {
    fontSize: Typography.fontSize['2xl'] - 2,
    fontWeight: Typography.fontWeight.bold,
    color: '#0F172A',
    marginBottom: Spacing.xs - 2,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: '#64748B',
    marginBottom: Spacing.xl,
    lineHeight: Typography.fontSize.base * 1.35,
  },
  formContainer: {
    marginTop: Spacing.xs,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  errorBoxText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.error,
    fontWeight: Typography.fontWeight.medium,
    marginLeft: Spacing.xs,
    flex: 1,
  },
  loginButton: {
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
  loginButtonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: Typography.fontSize.base + 2,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginRight: Spacing.xs,
  },
  chevronIcon: {
    marginTop: 1,
  },
});

export default LoginCard;
