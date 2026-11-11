// Reusable error message view with optional retry action.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { PrimaryButton } from './PrimaryButton';

export const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Unable to load data</Text>
    <Text style={styles.message}>{message}</Text>
    {onRetry ? <PrimaryButton label="Try Again" onPress={onRetry} /> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.danger,
    marginBottom: SPACING.xs,
  },
  message: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
});

