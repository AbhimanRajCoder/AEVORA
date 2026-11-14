// Primary Electric Sprout pill CTA and outlined secondary buttons per mobile_app/design.md.

import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

export const PrimaryButton = ({
  label,
  onPress,
  isLoading = false,
  disabled = false,
  variant = 'sprout',
  compact = false,
  style,
}) => {
  const isInactive = disabled || isLoading;
  const isOutlineDark = variant === 'outlineDark';
  const isOutlineLight = variant === 'outlineLight';

  const containerStyle = isOutlineDark
    ? styles.outlineDark
    : isOutlineLight
    ? styles.outlineLight
    : styles.sproutBg;

  const textStyle = isOutlineDark
    ? styles.textWhite
    : isOutlineLight
    ? styles.textOnyx
    : styles.textCarbon;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isInactive, busy: isLoading }}
      onPress={onPress}
      disabled={isInactive}
      style={({ pressed }) => [
        styles.button,
        compact ? styles.compactRadius : styles.pillRadius,
        compact ? styles.compactPadding : styles.pillPadding,
        containerStyle,
        isInactive && styles.disabled,
        pressed && !isInactive && styles.pressed,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={isOutlineDark ? COLORS.pureWhite : COLORS.carbon} />
      ) : (
        <Text style={[styles.label, textStyle]}>{label}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillRadius: { borderRadius: RADIUS.pill },
  compactRadius: { borderRadius: RADIUS.buttonCompact },
  pillPadding: { paddingVertical: SPACING.s16, paddingHorizontal: SPACING.s24 },
  compactPadding: { paddingVertical: SPACING.s8, paddingHorizontal: SPACING.s16 },
  sproutBg: {
    backgroundColor: COLORS.electricSprout,
  },
  outlineDark: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.pureWhite,
  },
  outlineLight: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.onyxOlive,
  },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.85 },
  label: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  textCarbon: { color: COLORS.carbon },
  textWhite: { color: COLORS.pureWhite },
  textOnyx: { color: COLORS.onyxOlive },
});
