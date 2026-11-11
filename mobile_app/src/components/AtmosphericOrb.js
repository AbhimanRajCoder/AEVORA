// Subtle abstract botanical orb atmosphere cropped behind dark Forest Depths hero sections.

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';

export const AtmosphericOrb = ({ style }) => (
  <View pointerEvents="none" style={[styles.orbOuter, style]}>
    <View style={styles.orbInner} />
  </View>
);

const styles = StyleSheet.create({
  orbOuter: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: RADIUS.orb,
    backgroundColor: COLORS.mossShadow,
    opacity: 0.42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbInner: {
    width: 180,
    height: 180,
    borderRadius: RADIUS.orb,
    backgroundColor: COLORS.electricSprout,
    opacity: 0.14,
  },
});

