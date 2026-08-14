/**
 * PrimaryButton Component
 * ─────────────────────────────────────────────────────────────────
 * Solid orange primary CTA button.
 */

import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@theme';

const PrimaryButton = ({
  title = 'Save Changes',
  onPress,
  iconName,
  isLoading = false,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.85}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={Colors.white} />
      ) : (
        <View style={styles.buttonContent}>
          {iconName ? (
            <Ionicons name={iconName} size={20} color={Colors.white} style={styles.leftIcon} />
          ) : null}
          <Text style={styles.buttonText}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.orangePrimary,
    borderRadius: BorderRadius.xl,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.orangePrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: Spacing.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: Spacing.xs + 2,
  },
  buttonText: {
    fontSize: Typography.fontSize.base + 2,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
});

export default PrimaryButton;
