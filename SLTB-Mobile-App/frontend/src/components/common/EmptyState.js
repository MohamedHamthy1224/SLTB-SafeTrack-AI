/**
 * EmptyState — Global Empty State Component
 * ─────────────────────────────────────────────────────────────────
 * Displays when a list or data section has no content to show.
 *
 * Usage:
 *   <EmptyState
 *     icon="notifications-none"
 *     title="No Alerts"
 *     message="You have no active alerts at this time."
 *     action={{ label: 'Refresh', onPress: refetch }}
 *   />
 *
 * Props:
 *   icon     {string}  — MaterialIcons icon name
 *   title    {string}  — Bold heading text
 *   message  {string}  — Descriptive sub-text
 *   action   {Object}  — Optional CTA button { label, onPress }
 *   style    {Object}  — Container style override
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, IconSize } from '@theme';

const EmptyState = ({
  icon = 'inbox',
  title = 'Nothing here',
  message = 'There is no data to display.',
  action = null,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Icon */}
      <View style={styles.iconWrapper}>
        <MaterialIcons
          name={icon}
          size={IconSize['3xl']}
          color={Colors.textMuted}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Message */}
      <Text style={styles.message}>{message}</Text>

      {/* Optional Action Button */}
      {action && (
        <TouchableOpacity
          style={styles.button}
          onPress={action.onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing['3xl'],
  },
  iconWrapper: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    marginBottom: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonText: {
    color: Colors.primaryLight,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },
});

export default EmptyState;
