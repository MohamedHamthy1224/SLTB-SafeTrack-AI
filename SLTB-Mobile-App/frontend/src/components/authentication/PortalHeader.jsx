/**
 * PortalHeader Component
 * ─────────────────────────────────────────────────────────────────
 * Renders the top logo section of the Internal Operations Portal:
 *   - Circular Orange Badge with Shield Icon
 *   - Uppercase, letter-spaced subtitle "INTERNAL OPERATIONS PORTAL"
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@theme';

const PortalHeader = () => {
  return (
    <View style={styles.container}>
      {/* Orange Circle Icon Badge */}
      <View style={styles.badgeWrapper}>
        <View style={styles.iconCircle}>
          <Ionicons name="shield-outline" size={44} color={Colors.white} />
        </View>
      </View>

      {/* Subtitle / Portal Title */}
      <Text style={styles.portalTitle}>INTERNAL OPERATIONS PORTAL</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  badgeWrapper: {
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.orangePrimary,
    alignItems: 'center',
    justifyContent: 'center',
    // Soft inner alignment
  },
  portalTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: '#71717A', // Refined grey
    letterSpacing: 1.6,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

export default PortalHeader;
