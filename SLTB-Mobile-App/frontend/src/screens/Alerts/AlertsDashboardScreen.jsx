/**
 * SLTB SafeTrack AI — Alerts Dashboard Screen
 * ─────────────────────────────────────────────────────────────────
 * Pixel-perfect implementation matching the reference design.
 *
 * Features:
 *   - Officer Header with Avatar, Greeting, and Notification Bell
 *   - Live Alerts Status section with active counter
 *   - FlatList feed rendering interactive alert cards (U-Turn & Bus alerts)
 *   - Smooth entrance animations & scale press feedback
 *   - Pull-to-refresh & direct navigation to Alert Details Screen
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing } from '@theme';
import { APP_ROUTES } from '@constants';
import {
  OfficerHeader,
  LiveStatus,
  AlertCard,
} from '@components/alerts';
import { alertData } from '@dummy';

const AlertsDashboardScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [fadeAnim]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleCardPress = (alertItem) => {
    navigation.navigate(APP_ROUTES.ALERT_DETAILS, {
      alertId: alertItem.id,
      alertType: alertItem.type,
    });
  };

  const handleNotificationPress = () => {
    // Notification action
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Officer Avatar & Greeting Header */}
      <OfficerHeader
        officerName="Officer James R."
        greetingText="Good Morning, ☀️"
        onNotificationPress={handleNotificationPress}
      />

      {/* Live Alerts Status Section */}
      <LiveStatus activeCount={alertData.length} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" backgroundColor={Colors.portalBg} />

      <Animated.View style={[styles.mainContainer, { opacity: fadeAnim }]}>
        <FlatList
          data={alertData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <AlertCard item={item} onPress={handleCardPress} />
          )}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
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
    backgroundColor: '#F8F9FA',
  },
  mainContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing['3xl'],
  },
  headerContainer: {
    marginBottom: Spacing.sm,
  },
});

export default AlertsDashboardScreen;
