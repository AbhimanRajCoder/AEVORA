// Empty state panel with calm Lichen Sage subtitle and editorial serif accent.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING, TYPE } from '../constants/theme';

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
    ...TYPE.subheading,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.onyxOlive,
    marginBottom: SPACING.s8,
  },
  subtitle: {
    ...TYPE.body,
    color: COLORS.lichenSage,
    textAlign: 'center',
  },
});
