/**
 * EncryptedSessionBadge Component
 * ─────────────────────────────────────────────────────────────────
 * Renders the rounded pill security indicator:
 *   "Secure 256-bit Encrypted Session"
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, BorderRadius } from '@theme';

const EncryptedSessionBadge = ({
  text = 'Secure 256-bit Encrypted Session',
  iconName = 'shield-checkmark-outline',
}) => {
  return (
    <View style={styles.badgeContainer}>
      <Ionicons
        name={iconName}
        size={16}
        color="#4B5563"
        style={styles.icon}
      />
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    alignSelf: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  icon: {
    marginRight: Spacing.xs + 2,
  },
  badgeText: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: Typography.fontWeight.medium,
    color: '#4B5563',
  },
});

export default EncryptedSessionBadge;
