// Flat neo-botanical card container (Bone White on light, Forest Depths on dark, or elevated tilted mockup).

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, ELEVATION, RADIUS, SPACING } from '../constants/theme';

export const Card = ({ children, variant = 'light', style }) => {
  const variantStyle =
    variant === 'dark'
      ? styles.dark
      : variant === 'floating'
      ? [styles.floating, ELEVATION.floatingMockup]
      : styles.light;

  return <View style={[styles.base, variantStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.card,
    padding: SPACING.s24,
    borderWidth: 1,
    marginBottom: SPACING.s16,
  },
  light: {
    backgroundColor: COLORS.boneWhite,
    borderColor: COLORS.mistGreen,
  },
  dark: {
    backgroundColor: COLORS.forestDepths,
    borderColor: COLORS.onyxOlive,
  },
  floating: {
    backgroundColor: COLORS.pureWhite,
    borderColor: COLORS.onyxOlive,
  },
});
