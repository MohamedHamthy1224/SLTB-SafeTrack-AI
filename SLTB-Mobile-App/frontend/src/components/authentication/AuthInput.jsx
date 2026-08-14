/**
 * AuthInput Component
 * ─────────────────────────────────────────────────────────────────
 * Reusable form input component matching the pixel-perfect design system:
 *   - Label & Right Label Action (e.g. Forgot Password?)
 *   - Left icon (Person / Lock)
 *   - Secure text entry toggle (Eye icon)
 *   - Orange focus highlight & Red error state
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@theme';

const AuthInput = ({
  label,
  rightLabelAction,
  leftIconName,
  placeholder,
  value,
  onChangeText,
  isPassword = false,
  error,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(isPassword);

  const toggleSecureEntry = () => {
    setIsSecure((prev) => !prev);
  };

  const getBorderColor = () => {
    if (error) return Colors.inputBorderError;
    if (isFocused) return Colors.inputBorderFocus;
    return Colors.inputBorder;
  };

  return (
    <View style={styles.container}>
      {/* Label Row */}
      {label ? (
        <View style={styles.labelRow}>
          <Text style={styles.labelText}>{label}</Text>
          {rightLabelAction ? (
            <TouchableOpacity
              onPress={rightLabelAction.onPress}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.rightLabelText}>{rightLabelAction.title}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      {/* Input Field Container */}
      <View style={[styles.inputContainer, { borderColor: getBorderColor() }]}>
        {/* Left Icon */}
        {leftIconName ? (
          <View style={styles.leftIconWrapper}>
            <Ionicons
              name={leftIconName}
              size={20}
              color={isFocused ? Colors.orangePrimary : '#374151'}
            />
          </View>
        ) : null}

        {/* Text Input */}
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={Colors.textPlaceholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
        />

        {/* Right Icon / Eye Toggle */}
        {isPassword ? (
          <TouchableOpacity
            style={styles.rightIconWrapper}
            onPress={toggleSecureEntry}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isSecure ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#374151"
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Validation Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs + 2,
  },
  labelText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: '#374151',
    letterSpacing: 1.0,
    textTransform: 'uppercase',
  },
  rightLabelText: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.orangePrimary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl, // Pill-like soft rounded corners
    borderWidth: 1.2,
    paddingHorizontal: Spacing.base,
  },
  leftIconWrapper: {
    marginRight: Spacing.sm,
  },
  rightIconWrapper: {
    paddingLeft: Spacing.xs,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: Typography.fontSize.base + 1,
    color: '#1F2937',
    fontWeight: Typography.fontWeight.medium,
  },
  errorText: {
    fontSize: Typography.fontSize.xs + 1,
    color: Colors.error,
    marginTop: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
    marginLeft: Spacing.xs,
  },
});

export default AuthInput;
