/**
 * LiveStatus Component
 * ─────────────────────────────────────────────────────────────────
 * Renders section header with shield icon, "Live Alerts" title,
 * live green indicator, and active alert counter.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, BorderRadius } from '@theme';

const LiveStatus = ({ activeCount = 3 }) => {
  return (
    <View style={styles.container}>
      {/* Top Title Row */}
      <View style={styles.topRow}>
        <View style={styles.leftTitleGroup}>
          <View style={styles.shieldBox}>
            <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.titleText}>Live Alerts</Text>
        </View>

        {/* Live Indicator */}
        <View style={styles.liveIndicator}>
          <View style={styles.greenDot} />
          <Text style={styles.liveText}>LIVE UPDATES</Text>
        </View>
      </View>

      {/* Active Count Subtitle */}
      <Text style={styles.activeCountText}>{activeCount} Active Alerts</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  leftTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shieldBox: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md + 2,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm + 2,
  },
  titleText: {
    fontSize: Typography.fontSize.xl + 2,
    fontWeight: Typography.fontWeight.bold,
    color: '#111827',
    letterSpacing: -0.4,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.8,
  },
  activeCountText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#6B7280',
    marginTop: 2,
  },
});

export default LiveStatus;
