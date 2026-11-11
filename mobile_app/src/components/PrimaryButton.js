// Accessible primary action button with disabled and loading state support.

import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

export const PrimaryButton = ({
  label,
  onPress,
  isLoading = false,
  disabled = false,
  variant = 'primary',
}) => {
  const isInactive = disabled || isLoading;
  const bgStyle = variant === 'danger' ? styles.dangerBg : styles.primaryBg;

  return (
    <Pressable
      onPress={onPress}
      disabled={isInactive}
      style={({ pressed }) => [
        styles.button,
        bgStyle,
        isInactive && styles.disabled,
        pressed && !isInactive && styles.pressed,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBg: {
    backgroundColor: COLORS.primary,
  },
  dangerBg: {
    backgroundColor: COLORS.danger,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
});

