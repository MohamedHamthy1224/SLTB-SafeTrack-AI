/**
 * SLTB SafeTrack AI — Edit Profile Screen (Screen 2)
 * ─────────────────────────────────────────────────────────────────
 * Pixel-perfect implementation matching Image 3 mockup.
 *
 * Features:
 *   - Profile Header with Back Action
 *   - Profile Image Uploader card with avatar & camera badge
 *   - Personal Information card with readonly fields (Lock icons) & editable contact field
 *   - Preferences card with segmented Light/Dark Theme selector
 *   - Primary "Save Changes" & Secondary "Cancel" actions
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { Colors, Spacing } from '@theme';
import {
  ProfileHeader,
  ProfileImageUploader,
  SectionTitle,
  ProfileInfoCard,
  FormInput,
  PreferenceCard,
  PrimaryButton,
  SecondaryButton,
} from '@components/profile';
import { profileData } from '@dummy';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [contactNumber, setContactNumber] = useState(profileData.contactNumber);
  const [isLoading, setIsLoading] = useState(false);

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
    navigation.goBack();
  };

  const handleChangePicture = () => {
    Toast.show({
      type: 'info',
      text1: 'Change Picture',
      text2: 'Photo upload features will be connected in Phase 2.',
      position: 'top',
    });
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      Toast.show({
        type: 'success',
        text1: 'Changes Saved',
        text2: 'Your contact information has been updated successfully.',
        position: 'top',
      });
      navigation.goBack();
    } catch (_err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Unable to save changes. Please try again.',
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" backgroundColor={Colors.portalBg} />

      {/* ── TOP HEADER ────────────────────────────────────────────── */}
      <ProfileHeader title="Edit Profile" onBack={handleBack} />

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
          {/* Profile Picture Card */}
          <ProfileImageUploader
            avatarUrl={profileData.avatarUrl}
            onChangePicturePress={handleChangePicture}
          />

          {/* Section Title: Personal Information */}
          <SectionTitle title="Personal Information" />

          {/* Personal Information Form Card */}
          <ProfileInfoCard style={styles.formCardPadding}>
            <FormInput
              label="Full Name"
              leftIconName="person-outline"
              value={profileData.officerName}
              readonly
            />
            <FormInput
              label="Badge Number"
              leftIconName="shield-outline"
              value={profileData.badgeNumber}
              readonly
            />
            <FormInput
              label="Role"
              leftIconName="person-outline"
              value={profileData.role}
              readonly
            />
            <FormInput
              label="Police Station"
              leftIconName="business-outline"
              value={profileData.policeStation}
              readonly
            />
            <FormInput
              label="Official Email"
              leftIconName="mail-outline"
              value={profileData.officialEmail}
              readonly
            />
            <FormInput
              label="Contact Number"
              leftIconName="call-outline"
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
            />
          </ProfileInfoCard>

          {/* Section Title: Preferences */}
          <SectionTitle title="Preferences" />

          {/* Preferences & Theme Selection Card */}
          <PreferenceCard />

          {/* Primary CTA: Save Changes */}
          <PrimaryButton
            title="Save Changes"
            iconName="save-outline"
            onPress={handleSaveChanges}
            isLoading={isLoading}
          />

          {/* Secondary CTA: Cancel */}
          <SecondaryButton
            title="Cancel"
            onPress={handleBack}
            variant="text"
            textColor="#64748B"
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
  formCardPadding: {
    paddingVertical: Spacing.md,
  },
});

export default EditProfileScreen;
