// Horizontal progress bar component for module completion and preparedness metrics.

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';

export const ProgressBar = ({ percentage = 0 }) => {
  const clamped = Math.max(0, Math.min(100, percentage));

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${clamped}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },
});

