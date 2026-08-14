/**
 * HistoryHeader Component
 * ─────────────────────────────────────────────────────────────────
 * Renders dark navy top header with Back action, title, subtitle,
 * and Filter + Sort actions matching the reference mockup.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '@theme';
import FilterButton from './FilterButton';
import SortButton from './SortButton';

const HistoryHeader = ({
  onBack,
  onFilter,
  onSort,
  title = 'Alerts History',
  subtitle = 'UPDATED 2H AGO',
}) => {
  return (
    <View style={styles.headerContainer}>
      {/* Left Back Arrow Action */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="chevron-back" size={26} color={Colors.white} />
      </TouchableOpacity>

      {/* Center Title & Subtitle */}
      <View style={styles.titleSection}>
        <Text style={styles.titleText}>{title}</Text>
        {subtitle ? <Text style={styles.subtitleText}>{subtitle}</Text> : null}
      </View>

      {/* Right Actions: Filter & Sort */}
      <View style={styles.rightActionsRow}>
        <FilterButton onPress={onFilter} />
        <SortButton onPress={onSort} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A1628',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
  },
  backButton: {
    padding: 4,
    marginRight: Spacing.xs,
  },
  titleSection: {
    flex: 1,
    marginLeft: Spacing.xs,
  },
  titleText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.0,
    marginTop: 2,
  },
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default HistoryHeader;
