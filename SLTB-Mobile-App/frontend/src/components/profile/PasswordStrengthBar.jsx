/**
 * PasswordStrengthBar Component
 * ─────────────────────────────────────────────────────────────────
 * Password strength evaluation indicator bar matching Image 1:
 *   - Label: "Password Strength: Weak / Medium / Strong"
 *   - 4-segment horizontal bar indicator
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography, Spacing, BorderRadius } from '@theme';

const PasswordStrengthBar = ({ password = '' }) => {
  // Simple strength rating calculation for UI display
  const getStrengthScore = () => {
    if (!password) return 1; // Default "Weak" state as in mockup
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9!@#$%^&*]/.test(password)) score++;
    return Math.max(1, score);
  };

  const score = getStrengthScore();

  const getLabelAndColor = () => {
    if (score <= 1) return { label: 'Weak', color: '#EF4444' };
    if (score === 2) return { label: 'Medium', color: '#F59E0B' };
    if (score === 3) return { label: 'Strong', color: '#F26522' };
    return { label: 'Very Strong', color: '#10B981' };
  };

  const { label, color } = getLabelAndColor();

  return (
    <View style={styles.container}>
      {/* Strength Header Text */}
      <View style={styles.headerRow}>
        <Text style={styles.labelTitle}>Password Strength:</Text>
        <Text style={[styles.labelValue, { color }]}>{label}</Text>
      </View>

      {/* 4-Segment Strength Bar */}
      <View style={styles.segmentsRow}>
        {[1, 2, 3, 4].map((index) => {
          const isActive = index <= score;
          return (
            <View
              key={index}
              style={[
                styles.segmentItem,
                { backgroundColor: isActive ? color : '#E2E8F0' },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  labelTitle: {
    fontSize: Typography.fontSize.xs + 2,
    fontWeight: Typography.fontWeight.bold,
    color: '#0F172A',
    marginRight: 6,
  },
  labelValue: {
    fontSize: Typography.fontSize.xs + 2,
    fontWeight: Typography.fontWeight.bold,
  },
  segmentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  segmentItem: {
    flex: 1,
    height: 5,
    borderRadius: BorderRadius.full,
    marginRight: 6,
  },
});

export default PasswordStrengthBar;
