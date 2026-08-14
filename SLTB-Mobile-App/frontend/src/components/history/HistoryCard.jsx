/**
 * HistoryCard Component
 * ─────────────────────────────────────────────────────────────────
 * Renders individual historical alert item matching the reference mockup:
 *   - Left alert type icon (Red warning triangle, Orange U-turn, Blue bus)
 *   - Title, Description, Bus No / Location detail line, Priority Badge
 *   - Right Date, Time, and Blue Status Dot indicator
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
import { Colors, Typography, Spacing } from '@theme';
import StatusIndicator from './StatusIndicator';
import PriorityBadge from '../alerts/PriorityBadge';

const HistoryCard = ({ item, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.985,
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

  const isUTurn = item.type === 'u_turn';

  // Left icon determination based on alert item
  const renderLeftIcon = () => {
    if (isUTurn) {
      return <MaterialIcons name="u-turn-left" size={38} color="#F26522" />;
    }
    if (item.priority === 'High') {
      return <Ionicons name="warning-outline" size={36} color="#EF4444" />;
    }
    return <Ionicons name="bus" size={36} color="#3B82F6" />;
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => onPress && onPress(item)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.cardContent}>
          {/* Left Icon Column */}
          <View style={styles.leftIconColumn}>{renderLeftIcon()}</View>

          {/* Center Details Section */}
          <View style={styles.centerSection}>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>

            {/* Bus No or Location Detail Line */}
            {item.busNo ? (
              <View style={styles.detailMetaRow}>
                <Ionicons name="bus-outline" size={16} color="#6B7280" style={styles.metaIcon} />
                <Text style={styles.metaText}>{item.busNo}</Text>
              </View>
            ) : item.location ? (
              <View style={styles.detailMetaRow}>
                <Ionicons name="location-outline" size={16} color="#6B7280" style={styles.metaIcon} />
                <Text style={styles.metaText}>{item.location}</Text>
              </View>
            ) : null}

            {/* Priority Badge */}
            <View style={styles.badgeWrapper}>
              <PriorityBadge
                priority={item.priority}
                variant="light"
                customText={item.priority ? item.priority.toUpperCase() : 'HIGH'}
              />
            </View>
          </View>

          {/* Right Timestamp & Status Indicator */}
          <View style={styles.rightSection}>
            {/* Top Right Blue Status Dot */}
            <View style={styles.statusDotWrapper}>
              <StatusIndicator color="#007AFF" size={9} />
            </View>

            {/* Date & Time */}
            <View style={styles.timeGroup}>
              <Text style={styles.dateText}>{item.date}</Text>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
          </View>
        </View>

        {/* Card Bottom Divider */}
        <View style={styles.divider} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: Spacing.lg,
  },
  leftIconColumn: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: Spacing.md,
    marginTop: 2,
  },
  centerSection: {
    flex: 1,
    paddingRight: Spacing.xs,
  },
  titleText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: '#111827',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: Typography.fontSize.sm + 1,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  detailMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  metaIcon: {
    marginRight: 6,
  },
  metaText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: '#4B5563',
  },
  badgeWrapper: {
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 80,
  },
  statusDotWrapper: {
    marginBottom: Spacing.sm,
  },
  timeGroup: {
    alignItems: 'flex-end',
    marginTop: 'auto',
  },
  dateText: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: Typography.fontWeight.bold,
    color: '#111827',
    marginBottom: 2,
  },
  timeText: {
    fontSize: Typography.fontSize.xs + 1,
    color: '#6B7280',
    fontWeight: Typography.fontWeight.regular,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
});

export default HistoryCard;
