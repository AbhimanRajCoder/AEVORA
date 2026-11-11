// Shared Profile screen showing current user details, backend health, and Sign Out.

import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { checkHealth } from '../../services/dashboardService';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { COLORS, SPACING } from '../../constants/theme';

export const ProfileScreen = () => {
  const { user, signOut, refreshUser } = useAuth();
  const [backendStatus, setBackendStatus] = useState('Checking...');

  useEffect(() => {
    refreshUser().catch(() => null);
    checkHealth()
      .then((res) => setBackendStatus(res?.status === 'online' ? 'Online (Connected)' : 'Unknown'))
      .catch(() => setBackendStatus('Offline / Unreachable'));
  }, [refreshUser]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Card>
        <Text style={styles.name}>{user?.full_name || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.value}>{user?.role?.toUpperCase()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Points:</Text>
          <Text style={styles.value}>{user?.points ?? 0} pts</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Backend API:</Text>
          <Text style={styles.value}>{backendStatus}</Text>
        </View>
      </Card>

      <PrimaryButton label="Sign Out" onPress={signOut} variant="danger" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.md },
  name: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  email: { fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.md },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  label: { fontSize: 14, color: COLORS.textMuted },
  value: { fontSize: 14, fontWeight: '700', color: COLORS.text },
});

