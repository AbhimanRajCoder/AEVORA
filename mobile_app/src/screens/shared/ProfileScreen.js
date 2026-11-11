// Shared Profile screen styled with Bone White panels, Sprout Wash chips, and outlined Sign Out.

import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { checkHealth } from '../../services/dashboardService';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { COLORS, FONTS, RADIUS, SPACING, TYPE } from '../../constants/theme';

export const ProfileScreen = () => {
  const { user, signOut, refreshUser } = useAuth();
  const [backendStatus, setBackendStatus] = useState('Checking...');

  useEffect(() => {
    refreshUser().catch(() => null);
    checkHealth()
      .then((res) => setBackendStatus(res?.status === 'online' ? 'Online' : 'Unknown'))
      .catch(() => setBackendStatus('Offline'));
  }, [refreshUser]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Card variant="dark">
        <View style={styles.rolePill}>
          <Text style={styles.rolePillText}>{user?.role?.toUpperCase() || 'USER'}</Text>
        </View>
        <Text style={styles.name}>{user?.full_name || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </Card>

      <Card variant="light">
        <View style={styles.row}>
          <Text style={styles.label}>Accumulated Points</Text>
          <View style={styles.sproutChip}>
            <Text style={styles.sproutChipText}>{user?.points ?? 0} pts</Text>
          </View>
        </View>
        <View style={[styles.row, styles.rowBorder]}>
          <Text style={styles.label}>Backend API</Text>
          <Text style={styles.serifStatus}>{backendStatus}</Text>
        </View>
      </Card>

      <PrimaryButton label="Sign Out" onPress={signOut} variant="outlineLight" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.pureWhite },
  container: { padding: SPACING.s24, paddingBottom: 112 },
  rolePill: {
    backgroundColor: COLORS.electricSprout,
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: SPACING.s16,
  },
  rolePillText: { fontSize: 11, fontWeight: '600', color: COLORS.carbon },
  name: { ...TYPE.heading, color: COLORS.pureWhite, marginBottom: 4 },
  email: { ...TYPE.body, color: COLORS.paleFern },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.s8,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: COLORS.mistGreen,
    marginTop: SPACING.s8,
    paddingTop: SPACING.s16,
  },
  label: { ...TYPE.body, color: COLORS.onyxOlive },
  sproutChip: {
    backgroundColor: COLORS.sproutWash,
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
  },
  sproutChipText: { fontSize: 13, fontWeight: '500', color: COLORS.mossShadow },
  serifStatus: {
    fontFamily: FONTS.serif,
    fontSize: 16,
    fontStyle: 'italic',
    color: COLORS.deepVerdant,
  },
});
