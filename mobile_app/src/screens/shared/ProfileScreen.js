// Student Profile screen displaying identity, campus name, points, backend status, and sign out.

import React, { useCallback, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { getInstitutions } from '../../services/authService';
import { checkHealth } from '../../services/dashboardService';
import { AtmosphericOrb } from '../../components/AtmosphericOrb';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { COLORS, FONTS, RADIUS, SPACING, TYPE } from '../../constants/theme';

export const ProfileScreen = ({ navigation }) => {
  const { user, signOut, refreshUser } = useAuth();
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [campusName, setCampusName] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadProfileState = useCallback(
    async (refresh = false) => {
      if (refresh) setIsRefreshing(true);
      try {
        const [profileRes, healthRes, institutionsRes] = await Promise.all([
          refreshUser().catch(() => user),
          checkHealth().catch(() => null),
          getInstitutions().catch(() => []),
        ]);
        setBackendStatus(healthRes?.status === 'online' ? 'Online' : 'Offline');
        const instId = profileRes?.institution_id || user?.institution_id;
        const matched = (institutionsRes || []).find((i) => i.id === instId);
        setCampusName(matched ? `${matched.name} (${matched.district})` : instId || 'Unassigned');
      } finally {
        setIsRefreshing(false);
      }
    },
    [refreshUser, user]
  );

  useFocusEffect(
    useCallback(() => {
      loadProfileState();
    }, [loadProfileState])
  );

  const confirmSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of AEVORA?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={() => loadProfileState(true)} />
      }
    >
      <Card variant="dark" style={styles.heroCard}>
        <AtmosphericOrb style={styles.orb} />
        <View style={styles.rolePill}>
          <Text style={styles.rolePillText}>{user?.role?.toUpperCase() || 'STUDENT'}</Text>
        </View>
        <Text style={styles.name}>{user?.full_name || 'Student'}</Text>
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
          <Text style={styles.label}>Campus</Text>
          <Text style={styles.valueText} numberOfLines={1}>
            {campusName || 'Unassigned'}
          </Text>
        </View>
        <View style={[styles.row, styles.rowBorder]}>
          <Text style={styles.label}>Backend API</Text>
          <Text style={[styles.serifStatus, backendStatus === 'Offline' && styles.offlineStatus]}>
            {backendStatus}
          </Text>
        </View>
      </Card>

      <PrimaryButton
        label="View Campus Leaderboard"
        onPress={() => navigation.navigate('Leaderboard')}
        style={styles.leaderboardBtn}
      />
      <PrimaryButton label="Sign Out" onPress={confirmSignOut} variant="outlineLight" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.pureWhite },
  container: { padding: SPACING.s24, paddingBottom: SPACING.s48 },
  heroCard: { overflow: 'hidden' },
  orb: { top: -110, right: -100 },
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
  label: { ...TYPE.body, color: COLORS.onyxOlive, marginRight: SPACING.s12 },
  valueText: { ...TYPE.caption, color: COLORS.lichenSage, flex: 1, textAlign: 'right' },
  sproutChip: {
    backgroundColor: COLORS.sproutWash,
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
  },
  sproutChipText: { fontSize: 13, fontWeight: '600', color: COLORS.mossShadow },
  serifStatus: { fontFamily: FONTS.serif, fontSize: 16, fontStyle: 'italic', color: COLORS.deepVerdant },
  offlineStatus: { color: COLORS.lichenSage },
  leaderboardBtn: { marginBottom: SPACING.s12 },
});
