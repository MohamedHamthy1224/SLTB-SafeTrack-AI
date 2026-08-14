/**
 * OfficerCard Component
 * ─────────────────────────────────────────────────────────────────
 * White rounded card displaying officer avatar with live online status badge,
 * full name, badge number, and optional role label.
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@theme';

const OfficerCard = ({
  officerName = 'Officer James R.',
  badgeNumber = 'TP001',
  role,
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  isOnline = true,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardInner}>
        {/* Left Avatar Container with Online Indicator */}
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          {isOnline ? <View style={styles.onlineBadge} /> : null}
        </View>

        {/* Right Officer Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.nameText}>{officerName}</Text>
          <Text style={styles.badgeText}>Badge No: {badgeNumber}</Text>
          {role ? <Text style={styles.roleText}>{role}</Text> : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: Spacing.lg,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2.5,
    borderColor: Colors.white,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: Typography.fontSize.xl + 2,
    fontWeight: Typography.fontWeight.bold,
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  badgeText: {
    fontSize: Typography.fontSize.sm + 1,
    color: '#64748B',
    fontWeight: Typography.fontWeight.medium,
    marginBottom: 2,
  },
  roleText: {
    fontSize: Typography.fontSize.sm + 1,
    color: Colors.orangePrimary,
    fontWeight: Typography.fontWeight.bold,
    marginTop: 2,
  },
});

export default OfficerCard;
