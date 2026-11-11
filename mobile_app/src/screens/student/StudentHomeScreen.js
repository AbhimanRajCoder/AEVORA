// Student Home dashboard displaying points, latest campus alert, and quick navigation.

import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { getModules } from '../../services/moduleService';
import { getAlerts } from '../../services/alertService';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { SeverityBadge } from '../../components/SeverityBadge';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

export const StudentHomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [latestAlert, setLatestAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadHomeData = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError('');
    try {
      const [modulesRes, alertsRes] = await Promise.all([getModules(), getAlerts()]);
      setModules(modulesRes || []);
      setLatestAlert(alertsRes && alertsRes.length > 0 ? alertsRes[0] : null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  if (isLoading) return <LoadingState message="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={() => loadHomeData()} />;

  const completedModules = modules.filter((m) => m.is_completed).length;
  const overallProgress =
    modules.length > 0
      ? Math.round(
          modules.reduce((sum, m) => sum + (m.progress_percentage || 0), 0) / modules.length
        )
      : 0;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={() => loadHomeData(true)} />
      }
    >
      <Card style={styles.heroCard}>
        <View style={styles.heroTop}>
          <Text style={styles.greeting}>Hello, {user?.full_name || 'Student'}</Text>
          <Pressable onPress={() => navigation.navigate('Profile')} style={styles.profilePill}>
            <Text style={styles.profilePillText}>Profile</Text>
          </Pressable>
        </View>
        <Text style={styles.points}>Total Points: {user?.points ?? 0} pts</Text>
        <ProgressBar percentage={overallProgress} />
        <Text style={styles.progressText}>
          {completedModules} of {modules.length} modules completed ({overallProgress}%)
        </Text>
      </Card>

      {latestAlert ? (
        <Pressable onPress={() => navigation.navigate('Alerts')}>
          <Card>
            <View style={styles.alertTop}>
              <SeverityBadge severity={latestAlert.severity} />
              <Text style={styles.linkText}>View All</Text>
            </View>
            <Text style={styles.cardTitle}>{latestAlert.title}</Text>
            <Text style={styles.cardBody} numberOfLines={2}>
              {latestAlert.message}
            </Text>
          </Card>
        </Pressable>
      ) : null}

      <View style={styles.quickGrid}>
        <Pressable style={styles.quickBtn} onPress={() => navigation.navigate('Modules')}>
          <Text style={styles.quickTitle}>Modules</Text>
          <Text style={styles.quickSub}>Safety lessons</Text>
        </Pressable>
        <Pressable style={styles.quickBtn} onPress={() => navigation.navigate('Drills')}>
          <Text style={styles.quickTitle}>Drills</Text>
          <Text style={styles.quickSub}>Practice scenarios</Text>
        </Pressable>
        <Pressable style={styles.quickBtn} onPress={() => navigation.navigate('Leaderboard')}>
          <Text style={styles.quickTitle}>Leaderboard</Text>
          <Text style={styles.quickSub}>Campus rankings</Text>
        </Pressable>
        <Pressable style={styles.quickBtn} onPress={() => navigation.navigate('Emergency')}>
          <Text style={styles.quickTitle}>SOS Contacts</Text>
          <Text style={styles.quickSub}>112 & campus</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.md },
  heroCard: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profilePill: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  profilePillText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  greeting: { fontSize: 20, fontWeight: '800', color: COLORS.text, flex: 1 },
  points: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginVertical: SPACING.xs },
  progressText: { fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.xs },
  alertTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  linkText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  cardBody: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  quickBtn: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  quickSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
});
