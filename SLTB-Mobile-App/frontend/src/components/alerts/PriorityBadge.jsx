/**
 * PriorityBadge Component
 * ─────────────────────────────────────────────────────────────────
 * Configurable badge pill supporting High, Medium, Low severity levels
 * and custom variants (light pill, solid fill, outline).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography, BorderRadius } from '@theme';

const PriorityBadge = ({ priority = 'High', variant = 'light', customText }) => {
  const textLabel = customText || priority;
  const normalized = priority.toLowerCase();

  // Color schemes matching design spec
  const colors = {
    high: {
      lightBg: '#FEE2E2',
      lightBorder: '#FCA5A5',
      text: '#EF4444',
      solidBg: '#EF4444',
    },
    medium: {
      lightBg: '#FFF0EA',
      lightBorder: '#FFC5B2',
      text: '#F26522',
      solidBg: '#F26522',
    },
    low: {
      lightBg: '#DBEAFE',
      lightBorder: '#93C5FD',
      text: '#3B82F6',
      solidBg: '#3B82F6',
    },
  }[normalized] || {
    lightBg: '#FEE2E2',
    lightBorder: '#FCA5A5',
    text: '#EF4444',
    solidBg: '#EF4444',
  };

  if (variant === 'solid') {
    return (
      <View style={[styles.badge, { backgroundColor: colors.solidBg, borderColor: colors.solidBg }]}>
        <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>{textLabel}</Text>
      </View>
    );
  }

  if (variant === 'outline') {
    return (
      <View style={[styles.badge, { backgroundColor: '#FFFFFF', borderColor: colors.text }]}>
        <Text style={[styles.badgeText, { color: colors.text }]}>{textLabel}</Text>
      </View>
    );
  }

  // Default light pill variant
  return (
    <View style={[styles.badge, { backgroundColor: colors.lightBg, borderColor: colors.lightBorder }]}>
      <Text style={[styles.badgeText, { color: colors.text }]}>{textLabel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
  },
});

export default PriorityBadge;
