/**
 * PortalFooter Component
 * ─────────────────────────────────────────────────────────────────
 * Renders department branding & app version at the bottom of the portal:
 *   - Sri Lanka Traffic Police Department
 *   - Application Version 1.4.2 (Production Build)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography, Spacing } from '@theme';

const PortalFooter = ({
  departmentText = 'Sri Lanka Traffic Police Department',
  versionText = 'Application Version 1.4.3 (Production Build)',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.departmentText}>{departmentText}</Text>
      <Text style={styles.versionText}>{versionText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    marginTop: 'auto', // Pushes to bottom in flex container
  },
  departmentText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: Spacing.xs - 2,
  },
  versionText: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: Typography.fontWeight.regular,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default PortalFooter;
