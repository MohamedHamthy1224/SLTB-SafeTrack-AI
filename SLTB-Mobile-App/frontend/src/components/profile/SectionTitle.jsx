/**
 * SectionTitle Component
 * ─────────────────────────────────────────────────────────────────
 * Renders standardized bold section title label across Profile modules.
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Typography, Spacing } from '@theme';

const SectionTitle = ({ title, style }) => {
  return <Text style={[styles.title, style]}>{title}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: Typography.fontSize.base + 1,
    fontWeight: Typography.fontWeight.bold,
    color: '#0F172A',
    marginBottom: Spacing.sm + 2,
    marginTop: Spacing.sm,
    letterSpacing: -0.2,
  },
});

export default SectionTitle;
