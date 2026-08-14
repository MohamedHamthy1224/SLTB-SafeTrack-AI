/**
 * ProfileHeader Component
 * ─────────────────────────────────────────────────────────────────
 * Renders top header bar for Profile screens with back button,
 * title, and optional right menu action.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '@theme';

const ProfileHeader = ({
  title = 'Profile',
  onBack,
  rightAction,
}) => {
  return (
    <View style={styles.headerRow}>
      {/* Left Back Arrow Action */}
      <TouchableOpacity
        style={styles.headerIconButton}
        onPress={onBack}
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="chevron-back" size={26} color="#0F172A" />
      </TouchableOpacity>

      {/* Centered Title */}
      <Text style={styles.titleText}>{title}</Text>

      {/* Right Action Button or Spacer */}
      {rightAction ? (
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={rightAction.onPress}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name={rightAction.iconName || 'ellipsis-vertical'} size={22} color="#0F172A" />
        </TouchableOpacity>
      ) : (
        <View style={styles.rightSpacer} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.portalBg,
  },
  headerIconButton: {
    padding: 4,
    width: 36,
    alignItems: 'flex-start',
  },
  titleText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: '#0F172A',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  rightSpacer: {
    width: 36,
  },
});

export default ProfileHeader;
