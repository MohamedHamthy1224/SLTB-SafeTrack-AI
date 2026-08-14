/**
 * ThemeSelector Component
 * ─────────────────────────────────────────────────────────────────
 * Segmented button selector for Light / Dark app themes.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@theme';

const ThemeSelector = ({ selectedTheme = 'light', onSelectTheme }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.segmentButton,
          selectedTheme === 'light' ? styles.activeLightSegment : styles.inactiveSegment,
        ]}
        onPress={() => onSelectTheme && onSelectTheme('light')}
        activeOpacity={0.8}
      >
        <Ionicons
          name="sunny-outline"
          size={16}
          color={selectedTheme === 'light' ? Colors.orangePrimary : '#64748B'}
          style={styles.icon}
        />
        <Text
          style={[
            styles.segmentText,
            selectedTheme === 'light' ? styles.activeText : styles.inactiveText,
          ]}
        >
          Light
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.segmentButton,
          selectedTheme === 'dark' ? styles.activeDarkSegment : styles.inactiveSegment,
        ]}
        onPress={() => onSelectTheme && onSelectTheme('dark')}
        activeOpacity={0.8}
      >
        <Ionicons
          name="moon-outline"
          size={16}
          color={selectedTheme === 'dark' ? '#0F172A' : '#64748B'}
          style={styles.icon}
        />
        <Text
          style={[
            styles.segmentText,
            selectedTheme === 'dark' ? styles.activeDarkText : styles.inactiveText,
          ]}
        >
          Dark
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.2,
    marginLeft: Spacing.xs,
  },
  activeLightSegment: {
    backgroundColor: '#FFF0EA',
    borderColor: Colors.orangePrimary,
  },
  activeDarkSegment: {
    backgroundColor: '#F1F5F9',
    borderColor: '#0F172A',
  },
  inactiveSegment: {
    backgroundColor: Colors.white,
    borderColor: '#E2E8F0',
  },
  icon: {
    marginRight: 4,
  },
  segmentText: {
    fontSize: Typography.fontSize.xs + 2,
    fontWeight: Typography.fontWeight.bold,
  },
  activeText: {
    color: Colors.orangePrimary,
  },
  activeDarkText: {
    color: '#0F172A',
  },
  inactiveText: {
    color: '#64748B',
  },
});

export default ThemeSelector;
