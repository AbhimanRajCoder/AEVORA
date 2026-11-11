// Loading state rendered in Forest Depths or Pure White canvas.

import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING, TYPE } from '../constants/theme';

export const LoadingState = ({ message = 'Loading...', dark = false }) => (
  <View style={[styles.container, dark ? styles.bgDark : styles.bgLight]}>
    <ActivityIndicator
      size="large"
      color={dark ? COLORS.electricSprout : COLORS.deepVerdant}
    />
    <Text style={[styles.text, dark ? styles.textDark : styles.textLight]}>
      {message}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.s24,
  },
  bgLight: { backgroundColor: COLORS.pureWhite },
  bgDark: { backgroundColor: COLORS.forestDepths },
  text: {
    ...TYPE.body,
    marginTop: SPACING.s16,
  },
  textLight: { color: COLORS.lichenSage },
  textDark: { color: COLORS.paleFern },
});
