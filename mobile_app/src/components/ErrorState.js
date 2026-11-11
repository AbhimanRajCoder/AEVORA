// Error state with hairline Bone White framing and Electric Sprout retry CTA.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING, TYPE } from '../constants/theme';
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
    padding: SPACING.s24,
    backgroundColor: COLORS.pureWhite,
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
