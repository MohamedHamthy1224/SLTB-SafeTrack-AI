/**
 * PlaceholderScreen
 * ─────────────────────────────────────────────────────────────────
 * A generic placeholder screen used in the navigation structure
 * during Phase 2 (infrastructure setup).
 *
 * This screen is referenced by AuthStack and AppStack for all routes
 * until real screens are built in Phase 3.
 *
 * REPLACE this in Phase 3 with the actual screen component.
 *
 * Props passed by React Navigation:
 *   route.name — The route/screen name being shown
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '@theme';

const PlaceholderScreen = ({ route }) => {
  const screenName = route?.name ?? 'Screen';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>

        {/* Icon */}
        <View style={styles.iconWrapper}>
          <MaterialIcons name="construction" size={48} color={Colors.accent} />
        </View>

        {/* Title */}
        <Text style={styles.title}>{screenName}</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Phase 2 — Infrastructure Ready</Text>

        {/* Badge */}
        <View style={styles.badge}>
          <MaterialIcons name="check-circle" size={14} color={Colors.success} />
          <Text style={styles.badgeText}>Navigation is working ✓</Text>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>🚀 SLTB SafeTrack AI</Text>
          <Text style={styles.infoText}>
            This is a placeholder for the <Text style={styles.highlight}>{screenName}</Text> screen.
          </Text>
          <Text style={styles.infoText}>
            Real UI will be built in Phase 3.
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.success + '40',
  },
  badgeText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.success,
    fontWeight: Typography.fontWeight.medium,
  },
  infoBox: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
  },
  infoTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  infoText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
  },
  highlight: {
    color: Colors.primaryLight,
    fontWeight: Typography.fontWeight.semiBold,
  },
});

export default PlaceholderScreen;
