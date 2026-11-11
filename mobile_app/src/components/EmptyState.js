// Empty state panel with calm Lichen Sage subtitle and editorial serif accent.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, SPACING, TYPE } from '../constants/theme';

export const EmptyState = ({ title = 'Nothing here yet', subtitle = '' }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.s32,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    fontStyle: 'italic',
    color: COLORS.onyxOlive,
    marginBottom: SPACING.s8,
  },
  subtitle: {
    ...TYPE.body,
    color: COLORS.lichenSage,
    textAlign: 'center',
  },
});
