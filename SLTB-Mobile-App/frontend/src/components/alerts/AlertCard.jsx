/**
 * AlertCard Component
 * ─────────────────────────────────────────────────────────────────
 * Renders individual traffic violation alert item with colored left border,
 * circular icon, title, description, time indicator, and priority badge.
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@theme';
import PriorityBadge from './PriorityBadge';

const AlertCard = ({ item, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const priorityLower = item.priority ? item.priority.toLowerCase() : 'high';

  // Left border & icon style mapping based on alert type & priority
  const themeMap = {
    high: {
      borderColor: '#EF4444',
      iconBg: '#FEE2E2',
      iconColor: '#EF4444',
    },
    medium: {
      borderColor: '#F26522',
      iconBg: '#FFF0EA',
      iconColor: '#F26522',
    },
    low: {
      borderColor: '#3B82F6',
      iconBg: '#DBEAFE',
      iconColor: '#3B82F6',
    },
  }[priorityLower] || {
    borderColor: '#EF4444',
    iconBg: '#FEE2E2',
    iconColor: '#EF4444',
  };

  const isUTurn = item.type === 'u_turn';

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.card, { borderLeftColor: themeMap.borderColor }]}
        onPress={() => onPress && onPress(item)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.cardInner}>
          {/* Left Circular Icon */}
          <View style={[styles.iconCircle, { backgroundColor: themeMap.iconBg }]}>
            {isUTurn ? (
              <MaterialIcons name="u-turn-left" size={32} color={themeMap.iconColor} />
            ) : (
              <Ionicons name="bus" size={28} color={themeMap.iconColor} />
            )}
          </View>

          {/* Center Details Section */}
          <View style={styles.contentSection}>
            <View style={styles.headerLine}>
              <Text style={styles.titleText}>{item.title}</Text>
              <PriorityBadge priority={item.priority} variant="light" />
            </View>

            <Text style={styles.descriptionText} numberOfLines={2}>
              {item.description}
            </Text>

            {/* Time Stamp */}
            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={15} color="#6B7280" style={styles.clockIcon} />
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 4,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    marginTop: 2,
  },
  contentSection: {
    flex: 1,
  },
  headerLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  titleText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: '#111827',
  },
  descriptionText: {
    fontSize: Typography.fontSize.sm + 1,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    marginRight: 4,
  },
  timeText: {
    fontSize: Typography.fontSize.xs + 1,
    color: '#6B7280',
    fontWeight: Typography.fontWeight.medium,
  },
});

export default AlertCard;
