/**
 * SLTB SafeTrack AI — Alert Details Screen
 * ─────────────────────────────────────────────────────────────────
 * Pixel-perfect implementation matching Image 2 (Bus Alert) & Image 3 (U-Turn Alert).
 *
 * Features:
 *   - Dark Navy Header with Back Button, Title, and Menu Action
 *   - Sub-header showing ALERT ID and Live status indicator
 *   - Top Summary Card with warning icon badge & active/priority badges
 *   - Technical Details Card rendering detailed specs for Bus or U-Turn alerts
 *   - Smooth fade-in & slide-up entrance animation
 */

import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@theme';
import { TechnicalDetailRow, PriorityBadge } from '@components/alerts';
import { busAlertDetail, uTurnAlertDetail } from '@dummy';

const AlertDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const alertId = route.params?.alertId;
  const alertType = route.params?.alertType;

  // Determine detail dataset (Bus Alert vs U-Turn Alert)
  const isBus = alertType === 'bus' || alertId === 3;
  const detailData = isBus ? busAlertDetail : uTurnAlertDetail;

  // Entrance animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="light" backgroundColor="#0F172A" />

      {/* ── 1. DARK NAVY TOP BAR ────────────────────────────────────── */}
      <View style={styles.darkNavyHeader}>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={handleBack}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={26} color={Colors.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitleText}>Alert Details</Text>

        <TouchableOpacity
          style={styles.headerIconButton}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="ellipsis-vertical" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* ── 2. SCROLLABLE CONTENT AREA ──────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.animatedWrapper,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Sub-Header Row: ALERT ID & Live Indicator */}
          <View style={styles.subHeaderRow}>
            <Text style={styles.alertIdText}>
              ALERT ID: <Text style={styles.alertIdValue}>{detailData.alertId}</Text>
            </Text>

            <View style={styles.liveBadgeRow}>
              <View style={styles.liveOrangeDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          {/* ── 3. TOP SUMMARY CARD ──────────────────────────────────── */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              {/* Left Warning Icon Badge */}
              <View style={styles.warningIconWrapper}>
                <View style={styles.warningIconCircle}>
                  {isBus ? (
                    <Ionicons name="bus" size={32} color="#EF4444" />
                  ) : (
                    <MaterialIcons name="u-turn-left" size={36} color="#EF4444" />
                  )}
                  <View style={styles.warningBadgeOverlay}>
                    <Ionicons name="warning" size={12} color={Colors.white} />
                  </View>
                </View>
              </View>

              {/* Middle Title & Description */}
              <View style={styles.summaryTextSection}>
                <Text style={styles.summaryTitle}>{detailData.title}</Text>
                <Text style={styles.summaryDescription}>{detailData.message}</Text>
              </View>

              {/* Right Priority & Active Badges */}
              <View style={styles.summaryBadgesColumn}>
                <PriorityBadge priority={detailData.priority} variant="solid" />
                <View style={styles.activePillGap} />
                <PriorityBadge priority="High" variant="outline" customText={detailData.status} />
              </View>
            </View>
          </View>

          {/* ── 4. TECHNICAL DETAILS CARD ────────────────────────────── */}
          <View style={styles.technicalCard}>
            {/* Header: Orange Gear Icon + Title */}
            <View style={styles.technicalHeaderRow}>
              <Ionicons name="settings-outline" size={22} color={Colors.orangePrimary} style={styles.gearIcon} />
              <Text style={styles.technicalHeaderTitle}>Technical Details</Text>
            </View>

            {/* Dynamic Specification Rows */}
            <View style={styles.specsContainer}>
              <TechnicalDetailRow
                iconName="document-text-outline"
                label="Title"
                value={detailData.title}
              />
              <TechnicalDetailRow
                iconName="chatbubble-ellipses-outline"
                label="Message"
                value={detailData.message}
              />
              <TechnicalDetailRow
                iconName="flag-outline"
                label="Priority"
                value={detailData.priority}
                valueColor="#EF4444"
              />

              {isBus ? (
                <>
                  <TechnicalDetailRow
                    iconName="bus-outline"
                    label="Bus Number"
                    value={detailData.busNumber}
                  />
                  <TechnicalDetailRow
                    iconName="bus-outline"
                    label="Service Type"
                    value={detailData.serviceType}
                  />
                  <TechnicalDetailRow
                    iconName="pricetag-outline"
                    label="Route Number"
                    value={detailData.routeNumber}
                  />
                  <TechnicalDetailRow
                    iconName="map-outline"
                    label="Route Name"
                    value={detailData.routeName}
                  />
                  <TechnicalDetailRow
                    iconName="location-outline"
                    label="Start Location"
                    value={detailData.startLocation}
                  />
                  <TechnicalDetailRow
                    iconName="location-outline"
                    label="End Location"
                    value={detailData.endLocation}
                  />
                  <TechnicalDetailRow
                    iconName="hardware-chip-outline"
                    label="Device ID"
                    value={detailData.deviceId}
                  />
                  <TechnicalDetailRow
                    iconName="location-outline"
                    label="Device Location"
                    value={detailData.deviceLocation}
                  />
                  <TechnicalDetailRow
                    iconName="time-outline"
                    label="Detected Time"
                    value={detailData.detectedTime}
                    isLast
                  />
                </>
              ) : (
                <>
                  <TechnicalDetailRow
                    iconName="pricetag-outline"
                    label="Route Number"
                    value={detailData.routeNumber}
                  />
                  <TechnicalDetailRow
                    iconName="map-outline"
                    label="Route Name"
                    value={detailData.routeName}
                  />
                  <TechnicalDetailRow
                    iconName="location-outline"
                    label="Start Location"
                    value={detailData.startLocation}
                  />
                  <TechnicalDetailRow
                    iconName="location-outline"
                    label="End Location"
                    value={detailData.endLocation}
                  />
                  <TechnicalDetailRow
                    iconName="compass-outline"
                    label="Location Name"
                    value={detailData.locationName}
                  />
                  <TechnicalDetailRow
                    iconName="hardware-chip-outline"
                    label="Device ID"
                    value={detailData.deviceId}
                  />
                  <TechnicalDetailRow
                    iconName="location-outline"
                    label="Device Location"
                    value={detailData.deviceLocation}
                  />
                  <TechnicalDetailRow
                    iconName="time-outline"
                    label="Detected Time"
                    value={detailData.detectedTime}
                    isLast
                  />
                </>
              )}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  darkNavyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
  },
  headerIconButton: {
    padding: 4,
  },
  headerTitleText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    letterSpacing: -0.3,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.portalBg,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing['3xl'],
  },
  animatedWrapper: {
    flex: 1,
  },

  /* Sub Header Row */
  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Spacing.md,
  },
  alertIdText: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: Typography.fontWeight.bold,
    color: '#6B7280',
    letterSpacing: 0.8,
  },
  alertIdValue: {
    color: '#374151',
  },
  liveBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveOrangeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.orangePrimary,
    marginRight: 6,
  },
  liveText: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.orangePrimary,
    letterSpacing: 0.8,
  },

  /* Summary Card */
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningIconWrapper: {
    marginRight: Spacing.md,
  },
  warningIconCircle: {
    position: 'relative',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningBadgeOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  summaryTextSection: {
    flex: 1,
    paddingRight: Spacing.xs,
  },
  summaryTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: '#111827',
    marginBottom: 4,
  },
  summaryDescription: {
    fontSize: Typography.fontSize.sm,
    color: '#4B5563',
    lineHeight: 18,
  },
  summaryBadgesColumn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  activePillGap: {
    height: 6,
  },

  /* Technical Details Card */
  technicalCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Shadows.card,
  },
  technicalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  gearIcon: {
    marginRight: Spacing.sm,
  },
  technicalHeaderTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: '#111827',
  },
  specsContainer: {
    marginTop: Spacing.xs,
  },
});

export default AlertDetailsScreen;
