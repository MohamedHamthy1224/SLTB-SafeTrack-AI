/**
 * OfficerHeader Component
 * ─────────────────────────────────────────────────────────────────
 * Top header displaying officer greeting, avatar, online status, and notification bell.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography, Spacing } from '@theme';
import OfficerAvatar from './OfficerAvatar';
import NotificationButton from './NotificationButton';

const OfficerHeader = ({
  officerName = 'Officer James R.',
  greetingText = 'Good Morning, ☀️',
  avatarUrl,
  onNotificationPress,
}) => {
  return (
    <View style={styles.headerRow}>
      <View style={styles.leftProfileSection}>
        <OfficerAvatar imageUrl={avatarUrl} size={48} isOnline />
        <View style={styles.textContainer}>
          <Text style={styles.greetingText}>{greetingText}</Text>
          <Text style={styles.officerNameText}>{officerName}</Text>
        </View>
      </View>

      <NotificationButton onPress={onNotificationPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  leftProfileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: Spacing.md,
  },
  greetingText: {
    fontSize: Typography.fontSize.sm,
    color: '#6B7280',
    fontWeight: Typography.fontWeight.medium,
  },
  officerNameText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: '#111827',
    letterSpacing: -0.3,
  },
});

export default OfficerHeader;
