/**
 * StatusIndicator Component
 * ─────────────────────────────────────────────────────────────────
 * Renders small circular blue status indicator dot.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

const StatusIndicator = ({ color = '#007AFF', size = 10 }) => {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dot: {
    alignSelf: 'flex-end',
  },
});

export default StatusIndicator;
