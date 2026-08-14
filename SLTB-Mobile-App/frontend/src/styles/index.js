/**
 * Global Styles — Index
 * ─────────────────────────────────────────────────────────────────
 * Global stylesheet definitions shared across all screens.
 *
 * This module exports reusable StyleSheet objects for:
 *   - Common layout patterns
 *   - Typography styles
 *   - Container styles
 *   - Form element styles
 *   - Utility classes
 *
 * NOTE: This is a foundational placeholder.
 *       Styles will be built alongside component development.
 */

import { StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@theme';

// ─────────────────────────────────────────────────────────────────
// Global Layout Styles
// ─────────────────────────────────────────────────────────────────
export const globalStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paddedContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.base,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
});

// ─────────────────────────────────────────────────────────────────
// Typography Styles
// ─────────────────────────────────────────────────────────────────
export const textStyles = StyleSheet.create({
  h1: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: Typography.fontSize['3xl'] * Typography.lineHeight.tight,
  },
  h2: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  h3: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  body: {
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
  },
  bodySecondary: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
