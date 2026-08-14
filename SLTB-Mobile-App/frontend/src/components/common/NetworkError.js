/**
 * NetworkError — Global Network Error Component
 * ─────────────────────────────────────────────────────────────────
 * Displayed when the device has no network connection,
 * or when an API request fails due to network issues.
 *
 * Two display modes:
 *   fullScreen — Takes up the entire screen (for page-level errors)
 *   inline     — Compact banner within a screen (for partial errors)
 *
 * Usage:
 *   // Full-screen mode
 *   <NetworkError onRetry={refetch} />
 *
 *   // Inline banner mode
 *   <NetworkError inline onRetry={refetch} />
 *
 * Props:
 *   inline   {boolean}  — Use compact inline display instead of full-screen
 *   onRetry  {Function} — Callback to retry the failed action
 *   message  {string}   — Custom error message
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, IconSize } from '@theme';

const NetworkError = ({
  inline = false,
  onRetry,
  message = "No internet connection. Please check your network and try again.",
}) => {
  // ── Inline Banner Mode ─────────────────────────────────────────
  if (inline) {
    return (
      <View style={styles.inlineContainer}>
        <MaterialIcons name="wifi-off" size={IconSize.md} color={Colors.warning} />
        <Text style={styles.inlineText}>No connection</Text>
        {onRetry && (
          <TouchableOpacity onPress={onRetry} style={styles.inlineButton}>
            <Text style={styles.inlineButtonText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // ── Full-Screen Mode ───────────────────────────────────────────
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <MaterialIcons
          name="wifi-off"
          size={IconSize['3xl']}
          color={Colors.textMuted}
        />
      </View>

      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.message}>{message}</Text>

      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.8}>
          <MaterialIcons name="refresh" size={IconSize.md} color={Colors.white} />
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // ── Full-screen ───────────────────────────────────────────────
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing['2xl'],
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
    fontWeight: Typography.fontWeight.bold,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  buttonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },

  // ── Inline Banner ─────────────────────────────────────────────
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.warningLight,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  inlineText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.textInverse,
    fontWeight: Typography.fontWeight.medium,
  },
  inlineButton: {
    paddingHorizontal: Spacing.sm,
  },
  inlineButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
  },
});

export default NetworkError;
