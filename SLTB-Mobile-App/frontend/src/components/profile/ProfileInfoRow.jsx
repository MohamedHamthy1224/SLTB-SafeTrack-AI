/**
 * ProfileInfoRow Component
 * ─────────────────────────────────────────────────────────────────
 * Renders individual specification row for officer details:
 *   - Left orange icon
 *   - Field label
 *   - Right field value
 *   - Bottom divider line
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '@theme';

const ProfileInfoRow = ({
  iconName = 'person-outline',
  label,
  value,
  isLast = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.rowInner}>
        {/* Left Orange Field Icon */}
        <View style={styles.iconWrapper}>
          <Ionicons name={iconName} size={20} color={Colors.orangePrimary} />
        </View>

        {/* Field Label */}
        <Text style={styles.labelText}>{label}</Text>

        {/* Right Field Value */}
        <Text style={styles.valueText} numberOfLines={1}>
          {value}
        </Text>
      </View>

      {/* Row Divider */}
      {!isLast ? <View style={styles.divider} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  rowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md + 2,
    justifyContent: 'space-between',
  },
  iconWrapper: {
    marginRight: Spacing.sm + 2,
  },
  labelText: {
    fontSize: Typography.fontSize.sm + 1,
    color: '#64748B',
    fontWeight: Typography.fontWeight.medium,
    width: 110,
  },
  valueText: {
    flex: 1,
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: Typography.fontWeight.bold,
    color: '#0F172A',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
});

export default ProfileInfoRow;
