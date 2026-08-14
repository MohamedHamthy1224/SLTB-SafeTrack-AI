/**
 * SLTB SafeTrack AI — Officer Profile Screen (Screen 1)
 * ─────────────────────────────────────────────────────────────────
 * Pixel-perfect implementation matching Image 2 mockup.
 *
 * Features:
 *   - Profile Header with Back Action
 *   - Officer Card with Avatar, Online Status, Name & Badge Number
 *   - Officer Information Card with role, station, email, contact details
 *   - Navigation buttons to Edit Profile, Change System Password, and Logout
 */

import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing } from '@theme';
import { APP_ROUTES } from '@constants';
import {
  ProfileHeader,
  OfficerCard,
  SectionTitle,
  ProfileInfoCard,
  ProfileInfoRow,
  SecondaryButton,
} from '@components/profile';
import { profileData } from '@dummy';

const ProfileScreen = () => {
  const navigation = useNavigation();

  // Entrance animation
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

  const handleEditProfile = () => {
    navigation.navigate(APP_ROUTES.EDIT_PROFILE);
  };

  const handleChangePassword = () => {
    navigation.navigate(APP_ROUTES.CHANGE_PASSWORD);
  };

  const handleLogout = () => {
    // UI placeholder action
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" backgroundColor={Colors.portalBg} />

      {/* ── TOP HEADER ────────────────────────────────────────────── */}
      <ProfileHeader title="Profile" onBack={handleBack} />

      {/* ── MAIN CONTENT AREA ──────────────────────────────────────── */}
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
          {/* Officer Profile Card */}
          <OfficerCard
            officerName={profileData.officerName}
            badgeNumber={profileData.badgeNumber}
            avatarUrl={profileData.avatarUrl}
            isOnline={profileData.isOnline}
          />

          {/* Section Title: Officer Information */}
          <SectionTitle title="Officer Information" />

          {/* Officer Information Card Grid */}
          <ProfileInfoCard>
            <ProfileInfoRow
              iconName="person-outline"
              label="Role"
              value={profileData.role}
            />
            <ProfileInfoRow
              iconName="person-outline"
              label="Full Name"
              value={profileData.officerName}
            />
            <ProfileInfoRow
              iconName="shield-outline"
              label="Badge Number"
              value={profileData.badgeNumber}
            />
            <ProfileInfoRow
              iconName="business-outline"
              label="Police Station"
              value={profileData.policeStation}
            />
            <ProfileInfoRow
              iconName="mail-outline"
              label="Official Email"
              value={profileData.officialEmail}
            />
            <ProfileInfoRow
              iconName="call-outline"
              label="Contact Number"
              value={profileData.contactNumber}
              isLast
            />
          </ProfileInfoCard>

          {/* Spacer */}
          <View style={styles.buttonSpacer} />

          {/* Button 1: Edit Profile */}
          <SecondaryButton
            title="Edit Profile"
            iconName="pencil-outline"
            onPress={handleEditProfile}
            variant="outlined"
            textColor={Colors.orangePrimary}
            borderColor={Colors.orangePrimary}
          />

          {/* Button 2: Change System Password */}
          <SecondaryButton
            title="Change System Password"
            onPress={handleChangePassword}
            variant="text"
            textColor="#DC2626"
          />

          {/* Button 3: Logout from System */}
          <SecondaryButton
            title="Logout from System"
            onPress={handleLogout}
            variant="text"
            textColor="#EF4444"
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.portalBg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing['3xl'],
  },
  animatedWrapper: {
    flex: 1,
  },
  buttonSpacer: {
    height: Spacing.md,
  },
});

export default ProfileScreen;
