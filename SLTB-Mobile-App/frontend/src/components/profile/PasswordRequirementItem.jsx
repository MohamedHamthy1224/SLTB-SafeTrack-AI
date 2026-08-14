/**
 * PasswordRequirementItem Component
 * ─────────────────────────────────────────────────────────────────
 * Individual checkmark requirement row for Change Password form matching Image 1:
 *   - Checkmark circle icon (gray / green)
 *   - Requirement description text
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing } from '@theme';

const PasswordRequirementItem = ({ label, isMet = false }) => {
  return (
    <View style={styles.row}>
      <Ionicons
        name={isMet ? 'checkmark-circle' : 'checkmark-circle-outline'}
        size={18}
        color={isMet ? '#10B981' : '#94A3B8'}
        style={styles.icon}
      />
      <Text style={[styles.text, isMet && styles.textMet]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs - 2,
  },
  icon: {
    marginRight: Spacing.xs + 2,
  },
  text: {
    fontSize: Typography.fontSize.xs + 2,
    color: '#64748B',
    fontWeight: Typography.fontWeight.medium,
  },
  textMet: {
    color: '#0F172A',
    fontWeight: Typography.fontWeight.bold,
  },
});

export default PasswordRequirementItem;
