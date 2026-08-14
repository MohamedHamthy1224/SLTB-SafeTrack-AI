/**
 * LoadingOverlay — Global Loading Component
 * ─────────────────────────────────────────────────────────────────
 * A semi-transparent overlay with a loading spinner.
 * Use for full-screen blocking loads (e.g., login in progress).
 *
 * Usage:
 *   <LoadingOverlay visible={isLoading} message="Signing in..." />
 *
 * Props:
 *   visible  {boolean}  — Whether to show the overlay
 *   message  {string}   — Optional status message below spinner
 *   opaque   {boolean}  — true = solid background, false = semi-transparent
 */

import React from 'react';
import { View, Modal, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@theme';

const LoadingOverlay = ({
  visible = false,
  message = 'Loading...',
  opaque = false,
}) => {
  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View style={[styles.backdrop, opaque && styles.backdropOpaque]}>
        <View style={styles.card}>
          <ActivityIndicator
            size="large"
            color={Colors.primaryLight}
            style={styles.spinner}
          />
          {message ? (
            <Text style={styles.message}>{message}</Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdropOpaque: {
    backgroundColor: Colors.background,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
    minWidth: 160,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  spinner: {
    marginBottom: Spacing.md,
  },
  message: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default LoadingOverlay;
