/**
 * OfficerAvatar Component
 * ─────────────────────────────────────────────────────────────────
 * Renders circular officer profile image with online indicator badge.
 */

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Colors } from '@theme';

const OfficerAvatar = ({
  imageUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  size = 48,
  isOnline = true,
}) => {
  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Image
        source={{ uri: imageUrl }}
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      />
      {isOnline ? <View style={styles.onlineBadge} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  avatar: {
    borderWidth: 2,
    borderColor: Colors.white,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: Colors.white,
  },
});

export default OfficerAvatar;
