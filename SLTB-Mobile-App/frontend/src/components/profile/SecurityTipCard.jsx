/**
 * SecurityTipCard Component
 * ─────────────────────────────────────────────────────────────────
 * Light blue security advice banner matching Image 1:
 *   - Blue shield outline icon inside circle badge
 *   - "Security Tip" title & advice message
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, BorderRadius } from '@theme';

const SecurityTipCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.cardInner}>
        {/* Left Circular Shield Icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="shield-outline" size={24} color="#3B82F6" />
        </View>

        {/* Right Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>Security Tip</Text>
          <Text style={styles.descriptionText}>
            Avoid using personal information like your name, birthday or phone number in your password.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EFF6FF',
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    borderColor: '#DBEAFE',
    padding: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: '#1E40AF',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: Typography.fontSize.sm,
    color: '#3B82F6',
    lineHeight: 20,
  },
});

export default SecurityTipCard;
