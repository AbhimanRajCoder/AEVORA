// Reusable empty state view for lists with zero records.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

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
    padding: SPACING.xl,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});

