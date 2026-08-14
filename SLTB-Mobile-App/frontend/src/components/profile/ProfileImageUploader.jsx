/**
 * ProfileImageUploader Component
 * ─────────────────────────────────────────────────────────────────
 * Card component for viewing and requesting profile avatar updates:
 *   - Avatar with camera badge icon
 *   - Title & format constraints subtitle
 *   - Outlined orange "Change Picture" button
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@theme';

const ProfileImageUploader = ({
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  onChangePicturePress,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardInner}>
        {/* Left Avatar with Camera Badge */}
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          <TouchableOpacity
            style={styles.cameraBadge}
            onPress={onChangePicturePress}
            activeOpacity={0.8}
          >
            <Ionicons name="camera" size={14} color={Colors.orangePrimary} />
          </TouchableOpacity>
        </View>

        {/* Right Info & Change Button */}
        <View style={styles.rightSection}>
          <Text style={styles.titleText}>Profile Picture</Text>
          <Text style={styles.subtitleText}>JPG, PNG or GIF. Max size of 2MB.</Text>

          <TouchableOpacity
            style={styles.changeButton}
            onPress={onChangePicturePress}
            activeOpacity={0.75}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={16}
              color={Colors.orangePrimary}
              style={styles.uploadIcon}
            />
            <Text style={styles.changeButtonText}>Change Picture</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: Spacing.lg,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.xs,
  },
  rightSection: {
    flex: 1,
  },
  titleText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: '#0F172A',
    marginBottom: 2,
  },
  subtitleText: {
    fontSize: Typography.fontSize.xs + 1,
    color: '#64748B',
    marginBottom: Spacing.sm + 2,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: Colors.orangePrimary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    alignSelf: 'flex-start',
  },
  uploadIcon: {
    marginRight: 6,
  },
  changeButtonText: {
    fontSize: Typography.fontSize.xs + 2,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.orangePrimary,
  },
});

export default ProfileImageUploader;
