// Reusable surface card container.

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

export const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
});

