/**
 * SLTB SafeTrack AI — Alert History Screen
 * ─────────────────────────────────────────────────────────────────
 * Pixel-perfect implementation matching the reference mockup.
 *
 * Features:
 *   - Dark Navy top header (#0A1628) with Back action, Title, Subtitle, Filter & Sort buttons
 *   - Body section header ("Alert History" / "Showing 3 results")
 *   - FlatList feed rendering reusable HistoryCard items
 *   - Smooth entrance animations & press feedback
 *   - Pull-to-refresh & direct navigation to AlertDetailsScreen
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing } from '@theme';
import { APP_ROUTES } from '@constants';
import { HistoryHeader, HistoryCard } from '@components/history';
import { historyData } from '@dummy';

const HistoryScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

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
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate(APP_ROUTES.DASHBOARD);
    }
  };

  const handleFilter = () => {
    // Filter action
  };

  const handleSort = () => {
    // Sort action
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleCardPress = (historyItem) => {
    navigation.navigate(APP_ROUTES.ALERT_DETAILS, {
      alertId: historyItem.id,
      alertType: historyItem.type,
    });
  };

  const renderSectionHeader = () => (
    <View style={styles.sectionHeaderBox}>
      <Text style={styles.sectionTitle}>Alert History</Text>
      <Text style={styles.sectionSubtitle}>
        Showing {historyData.length} results
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="light" backgroundColor="#0A1628" />

      {/* ── 1. DARK NAVY TOP HEADER ───────────────────────────────── */}
      <HistoryHeader
        onBack={handleBack}
        onFilter={handleFilter}
        onSort={handleSort}
        title="Alerts History"
        subtitle="UPDATED 2H AGO"
      />

      {/* ── 2. SCROLLABLE HISTORY LIST ────────────────────────────── */}
      <Animated.View
        style={[
          styles.mainContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <FlatList
          data={historyData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <HistoryCard item={item} onPress={handleCardPress} />
          )}
          ListHeaderComponent={renderSectionHeader}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.orangePrimary]}
              tintColor={Colors.orangePrimary}
            />
          }
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  mainContent: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContainer: {
    paddingBottom: Spacing['3xl'],
  },
  sectionHeaderBox: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: Typography.fontSize['2xl'] - 2,
    fontWeight: Typography.fontWeight.bold,
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.base,
    color: '#64748B',
    fontWeight: Typography.fontWeight.medium,
  },
});

export default HistoryScreen;
