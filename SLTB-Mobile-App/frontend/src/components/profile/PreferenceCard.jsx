/**
 * PreferenceCard Component
 * ─────────────────────────────────────────────────────────────────
 * Preferences section card wrapping app theme selection.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@theme';
import ThemeSelector from './ThemeSelector';

const PreferenceCard = () => {
  const [selectedTheme, setSelectedTheme] = useState('light');

  return (
    <View style={styles.card}>
      <View style={styles.cardInner}>
        {/* Left Orange Sun Icon */}
        <View style={styles.iconWrapper}>
          <Ionicons name="sunny-outline" size={24} color={Colors.orangePrimary} />
        </View>

        {/* Middle Label & Subtitle */}
        <View style={styles.textSection}>
          <Text style={styles.titleText}>Theme</Text>
          <Text style={styles.subtitleText}>Choose your preferred app theme</Text>
        </View>

        {/* Right Segmented Selector */}
        <ThemeSelector
          selectedTheme={selectedTheme}
          onSelectTheme={(theme) => setSelectedTheme(theme)}
        />
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
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrapper: {
    marginRight: Spacing.md,
  },
  textSection: {
    flex: 1,
    marginRight: Spacing.xs,
  },
  titleText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: '#0F172A',
    marginBottom: 2,
  },
  subtitleText: {
    fontSize: Typography.fontSize.xs + 1,
    color: '#64748B',
  },
});

export default PreferenceCard;
