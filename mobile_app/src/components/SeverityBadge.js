// Status and severity pill badge with 4px vertical padding and hairline border.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SEVERITY_STYLES } from '../constants/severity';
import { FONTS, RADIUS, SPACING } from '../constants/theme';

export const SeverityBadge = ({ severity = 'info' }) => {
  const badge = SEVERITY_STYLES[severity] || SEVERITY_STYLES.info;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: badge.bg, borderColor: badge.border },
      ]}
    >
      <Text style={[styles.label, { color: badge.text }]}>{badge.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: SPACING.badgeV,
    borderRadius: RADIUS.badge,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: FONTS.ui,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
});
