/**
 * SecondaryButton Component
 * ─────────────────────────────────────────────────────────────────
 * Outlined or text secondary action button.
 */

import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@theme';

const SecondaryButton = ({
  title,
  onPress,
  iconName,
  variant = 'outlined',
  textColor = Colors.orangePrimary,
  borderColor = Colors.orangePrimary,
  style,
}) => {
  if (variant === 'text') {
    return (
      <TouchableOpacity
        style={[styles.textButton, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.textButtonLabel, { color: textColor }]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.outlinedButton, { borderColor }, style]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.buttonContent}>
        {iconName ? (
          <Ionicons name={iconName} size={18} color={textColor} style={styles.leftIcon} />
        ) : null}
        <Text style={[styles.outlinedButtonText, { color: textColor }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outlinedButton: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginBottom: Spacing.md,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: Spacing.xs + 2,
  },
  outlinedButtonText: {
    fontSize: Typography.fontSize.base + 1,
    fontWeight: Typography.fontWeight.bold,
  },
  textButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButtonLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
  },
});

export default SecondaryButton;
