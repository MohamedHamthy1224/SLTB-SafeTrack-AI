/**
 * SLTB SafeTrack AI — Officer Home Dashboard Screen
 * ─────────────────────────────────────────────────────────────────
 * Pixel-perfect implementation matching the Internal Operations design mockup.
 *
 * Features:
 *   - Responsive header with Officer Avatar, online badge & notification bell
 *   - "Traffic Safe" brand card with current date pill badge
 *   - 2x2 Stat Cards Grid (Total Bus Alerts, Total U-Turn Alerts, Total Buses, Total U-Turns)
 *   - Assigned Route & Bus Card (Dummy Data)
 *   - Quick Actions & Emergency Alert Action
 *   - Recent Activity Timeline Feed (Dummy Data)
 *   - Pull-to-refresh & Logout action
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@theme';
import { useAuthContext } from '@contexts';

const DashboardScreen = () => {
  const { user, logout } = useAuthContext();
  const [refreshing, setRefreshing] = useState(false);

  const officerName = user?.full_name || 'Officer James R.';
  const officerRank = user?.rank || 'Inspector';
  const policeStation = user?.police_station || 'Batticaloa Traffic Division';

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.portalBg} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.orangePrimary]} />
        }
      >
        {/* ── 1. HEADER SECTION ────────────────────────────────────────── */}
        <View style={styles.headerRow}>
          <View style={styles.profileSection}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{
                  uri: user?.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
                }}
                style={styles.avatarImage}
              />
              <View style={styles.onlineBadge} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.greetingText}>Good Morning, ☀️</Text>
              <Text style={styles.officerNameText}>{officerName}</Text>
            </View>
          </View>

          <View style={styles.headerRightActions}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={24} color={Colors.textDark} />
              <View style={styles.notificationBadgeDot}>
                <Text style={styles.notificationBadgeText}>8</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.iconButton, styles.logoutButton]} onPress={logout} activeOpacity={0.7}>
              <Ionicons name="log-out-outline" size={22} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 2. TRAFFIC SAFE BRAND CARD ───────────────────────────────── */}
        <View style={styles.brandCard}>
          <View style={styles.brandLeft}>
            <View style={styles.shieldBadge}>
              <Ionicons name="shield-checkmark" size={22} color={Colors.white} />
            </View>
            <Text style={styles.brandTitle}>Traffic Safe</Text>
          </View>
          <View style={styles.datePill}>
            <Text style={styles.datePillText}>MON, OCT 24</Text>
          </View>
        </View>

        {/* ── 3. 2x2 STATISTICS CARDS GRID ─────────────────────────────── */}
        <View style={styles.gridContainer}>
          {/* Top Left Card — Total Bus Alerts */}
          <View style={[styles.statCard, { borderLeftColor: '#EF4444' }]}>
            <View style={[styles.cardIconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="bus-outline" size={26} color="#EF4444" />
            </View>
            <Text style={styles.statNumber}>124</Text>
            <Text style={styles.statLabel}>TOTAL BUS ALERTS</Text>
          </View>

          {/* Top Right Card — Total U-Turn Alerts */}
          <View style={[styles.statCard, { borderLeftColor: '#F26522' }]}>
            <View style={[styles.cardIconCircle, { backgroundColor: '#FFF0EA' }]}>
              <MaterialIcons name="u-turn-left" size={28} color="#F26522" />
            </View>
            <Text style={styles.statNumber}>48</Text>
            <Text style={styles.statLabel}>TOTAL U-TURN ALERTS</Text>
          </View>

          {/* Bottom Left Card — Total Buses */}
          <View style={[styles.statCard, { borderLeftColor: '#3B82F6' }]}>
            <View style={[styles.cardIconCircle, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="bus" size={26} color="#3B82F6" />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>TOTAL BUSES</Text>
          </View>

          {/* Bottom Right Card — Total U-Turns */}
          <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
            <View style={[styles.cardIconCircle, { backgroundColor: '#D1FAE5' }]}>
              <MaterialIcons name="u-turn-right" size={28} color="#10B981" />
            </View>
            <Text style={styles.statNumber}>07</Text>
            <Text style={styles.statLabel}>TOTAL U-TURNS</Text>
          </View>
        </View>

        {/* ── 4. TODAY'S ASSIGNED ROUTE & BUS ─────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Assignment</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAllText}>Details →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.assignmentCard}>
          <View style={styles.assignmentRow}>
            <View style={styles.assignmentIconBox}>
              <Ionicons name="map" size={24} color={Colors.orangePrimary} />
            </View>
            <View style={styles.assignmentInfo}>
              <Text style={styles.routeBadgeText}>ROUTE #102</Text>
              <Text style={styles.routeNameText}>Batticaloa – Colombo Central</Text>
              <Text style={styles.stationSubText}>{policeStation} • {officerRank}</Text>
            </View>
            <View style={styles.statusPillActive}>
              <View style={styles.statusDotGreen} />
              <Text style={styles.statusPillText}>ACTIVE</Text>
            </View>
          </View>

          <View style={styles.assignmentDivider} />

          <View style={styles.busDetailsRow}>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Assigned Bus</Text>
              <Text style={styles.detailValue}>SLTB-001 (NB-4587)</Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Depot</Text>
              <Text style={styles.detailValue}>Batticaloa Main</Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Shift</Text>
              <Text style={styles.detailValue}>Morning (06:00 - 14:00)</Text>
            </View>
          </View>
        </View>

        {/* ── 5. QUICK ACTIONS & EMERGENCY ALERT ──────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#EF4444' }]} activeOpacity={0.85}>
            <Ionicons name="warning" size={22} color={Colors.white} />
            <Text style={styles.actionBtnText}>Emergency SOS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.orangePrimary }]} activeOpacity={0.85}>
            <Ionicons name="add-circle" size={22} color={Colors.white} />
            <Text style={styles.actionBtnText}>Report Alert</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#1E40AF' }]} activeOpacity={0.85}>
            <Ionicons name="call" size={22} color={Colors.white} />
            <Text style={styles.actionBtnText}>Call Dispatch</Text>
          </TouchableOpacity>
        </View>

        {/* ── 6. RECENT ACTIVITY TIMELINE ─────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>

        <View style={styles.activityContainer}>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: '#EF4444' }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Speeding alert recorded for Bus <Text style={styles.boldText}>SLTB-001</Text> (78 km/h in 50 km/h zone)</Text>
              <Text style={styles.activityTime}>2 minutes ago</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: '#F26522' }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>U-turn distance warning at Batticaloa Junction RSU</Text>
              <Text style={styles.activityTime}>15 minutes ago</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: '#10B981' }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Inspector Nimal Perera acknowledged alert #402</Text>
              <Text style={styles.activityTime}>1 hour ago</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing['3xl'],
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: Typography.fontSize.sm,
    color: '#6B7280',
    fontWeight: Typography.fontWeight.medium,
  },
  officerNameText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: '#111827',
    letterSpacing: -0.3,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
    ...Shadows.xs,
  },
  logoutButton: {
    marginLeft: 4,
  },
  notificationBadgeDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  notificationBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },

  /* Brand Card */
  brandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius['2xl'],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shieldBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  brandTitle: {
    fontSize: Typography.fontSize.lg + 1,
    fontWeight: Typography.fontWeight.bold,
    color: '#111827',
  },
  datePill: {
    backgroundColor: '#F3F4F6',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  datePillText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: '#6B7280',
    letterSpacing: 0.8,
  },

  /* Grid Container */
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    width: '47.5%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 4,
    ...Shadows.card,
  },
  cardIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 38,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: '#6B7280',
    letterSpacing: 0.5,
  },

  /* Section Header */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: '#111827',
  },
  seeAllText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.orangePrimary,
  },

  /* Assignment Card */
  assignmentCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  assignmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignmentIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.orangeLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  assignmentInfo: {
    flex: 1,
  },
  routeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.orangePrimary,
    letterSpacing: 0.8,
  },
  routeNameText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: '#111827',
  },
  stationSubText: {
    fontSize: Typography.fontSize.xs,
    color: '#6B7280',
    marginTop: 2,
  },
  statusPillActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
  },
  statusDotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
  },
  assignmentDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: Spacing.md,
  },
  busDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: Typography.fontWeight.medium,
  },
  detailValue: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: Typography.fontWeight.bold,
    color: '#111827',
    marginTop: 2,
  },

  /* Actions Row */
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.xs,
    gap: 6,
    ...Shadows.xs,
  },
  actionBtnText: {
    color: Colors.white,
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: Typography.fontWeight.bold,
  },

  /* Activity Container */
  activityContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Shadows.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: Typography.fontSize.sm,
    color: '#374151',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '700',
    color: '#111827',
  },
  activityTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
});

export default DashboardScreen;
