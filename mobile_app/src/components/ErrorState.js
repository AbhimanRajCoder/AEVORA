// Framed error state card with clear explanation and Electric Sprout retry CTA.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from './Card';
import { PrimaryButton } from './PrimaryButton';
import { COLORS, RADIUS, SPACING, TYPE } from '../constants/theme';

export const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <View style={styles.container}>
    <Card variant="light" style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>CONNECTION NOTICE</Text>
      </View>
      <Text style={styles.title}>Unable to load data</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <PrimaryButton label="Try Again" onPress={onRetry} /> : null}
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.s24,
    backgroundColor: COLORS.pureWhite,
  },
  card: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 0,
  },
  badge: {
    backgroundColor: COLORS.forestDepths,
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
    marginBottom: SPACING.s16,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: COLORS.electricSprout,
  },
  title: {
    ...TYPE.headingSm,
    color: COLORS.onyxOlive,
    marginBottom: SPACING.s8,
  },
  message: {
    ...TYPE.body,
    color: COLORS.lichenSage,
    textAlign: 'center',
    marginBottom: SPACING.s24,
  },
});
