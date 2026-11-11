// Pure React Native geometric tab icons matching the neo-botanical aesthetic.

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/theme';

// Renders a minimal crisp glyph for each StudentTabs route.
export const TabIcon = ({ name, active }) => {
  const color = active ? COLORS.carbon : COLORS.paleFern;

  if (name === 'Home') {
    return (
      <View style={styles.box}>
        <View style={[styles.roof, { borderBottomColor: color }]} />
        <View style={[styles.houseBody, { borderColor: color }]} />
      </View>
    );
  }

  if (name === 'Modules') {
    return (
      <View style={styles.box}>
        <View style={[styles.bookOutline, { borderColor: color }]}>
          <View style={[styles.bookSpine, { backgroundColor: color }]} />
        </View>
      </View>
    );
  }

  if (name === 'Drills') {
    return (
      <View style={styles.box}>
        <View style={[styles.shieldRing, { borderColor: color }]}>
          <View style={[styles.shieldCore, { backgroundColor: color }]} />
        </View>
      </View>
    );
  }

  if (name === 'Alerts') {
    return (
      <View style={styles.box}>
        <View style={[styles.bellDome, { borderColor: color }]} />
        <View style={[styles.bellClapper, { backgroundColor: color }]} />
      </View>
    );
  }

  return (
    <View style={styles.box}>
      <View style={[styles.crossH, { backgroundColor: color }]} />
      <View style={[styles.crossV, { backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  roof: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  houseBody: {
    width: 10,
    height: 7,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  bookOutline: {
    width: 14,
    height: 12,
    borderWidth: 1.5,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookSpine: {
    width: 1.5,
    height: 10,
  },
  shieldRing: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldCore: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  bellDome: {
    width: 11,
    height: 10,
    borderWidth: 1.5,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  bellClapper: {
    width: 4,
    height: 2,
    borderRadius: 1,
    marginTop: 1,
  },
  crossH: {
    position: 'absolute',
    width: 12,
    height: 2.5,
    borderRadius: 1.5,
  },
  crossV: {
    position: 'absolute',
    width: 2.5,
    height: 12,
    borderRadius: 1.5,
  },
});

