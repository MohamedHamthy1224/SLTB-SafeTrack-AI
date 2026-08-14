/**
 * TechnicalDetailRow Component
 * ─────────────────────────────────────────────────────────────────
 * Renders individual specification field row for Alert Details screen:
 *   - Left icon (Document, Message, Flag, Bus, Route, Location, Device, Time)
 *   - Label (Title, Message, Priority, Bus Number, etc.)
 *   - Value (with special color for Priority / Status)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing } from '@theme';

const TechnicalDetailRow = ({
  iconName = 'information-circle-outline',
  label,
  value,
  isLast = false,
  valueColor,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.rowInner}>
        {/* Left Field Icon */}
        <View style={styles.iconWrapper}>
          <Ionicons name={iconName} size={18} color="#6B7280" />
        </View>

        {/* Field Label */}
        <Text style={styles.labelText}>{label}</Text>

        {/* Field Value */}
        <Text
          style={[
            styles.valueText,
            valueColor ? { color: valueColor, fontWeight: '700' } : null,
          ]}
        >
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
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    justifyContent: 'space-between',
  },
  iconWrapper: {
    marginRight: Spacing.sm + 2,
    marginTop: 2,
  },
  labelText: {
    fontSize: Typography.fontSize.sm + 1,
    color: '#6B7280',
    fontWeight: Typography.fontWeight.medium,
    width: 120,
  },
  valueText: {
    flex: 1,
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#111827',
    textAlign: 'right',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
});

export default TechnicalDetailRow;
