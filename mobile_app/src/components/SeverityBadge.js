// Badge displaying alert severity (info, warning, critical).

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SEVERITY_STYLES } from '../constants/severity';
import { RADIUS } from '../constants/theme';

export const SeverityBadge = ({ severity = 'info' }) => {
  const badge = SEVERITY_STYLES[severity] || SEVERITY_STYLES.info;

  return (
    <View style={[styles.badge, { backgroundColor: badge.bg }]}>
      <Text style={[styles.label, { color: badge.text }]}>{badge.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
  },
});

