// Flat horizontal progress bar using Electric Sprout or Deep Verdant fill.

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';

export const ProgressBar = ({ percentage = 0, dark = false }) => {
  const clamped = Math.max(0, Math.min(100, percentage));

  return (
    <View style={[styles.track, dark ? styles.trackDark : styles.trackLight]}>
      <View
        style={[
          styles.fill,
          { width: `${clamped}%`, backgroundColor: dark ? COLORS.electricSprout : COLORS.deepVerdant },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: RADIUS.orb,
    overflow: 'hidden',
  },
  trackLight: {
    backgroundColor: COLORS.mistGreen,
  },
  trackDark: {
    backgroundColor: COLORS.onyxOlive,
  },
  fill: {
    height: '100%',
    borderRadius: RADIUS.orb,
  },
});
