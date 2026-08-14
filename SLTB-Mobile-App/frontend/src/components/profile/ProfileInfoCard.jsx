/**
 * ProfileInfoCard Component
 * ─────────────────────────────────────────────────────────────────
 * Card wrapper grouping Officer information specification rows.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '@theme';

const ProfileInfoCard = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius['2xl'],
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
});

export default ProfileInfoCard;
