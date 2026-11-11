// Admin Dashboard alternating Forest Depths preparedness hero and Pure White / Bone White metrics.

import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDashboardStats } from '../../services/dashboardService';
import { AtmosphericOrb } from '../../components/AtmosphericOrb';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { COLORS, FONTS, RADIUS, SPACING, TYPE } from '../../constants/theme';

export const AdminDashboardScreen = () => {
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError('');
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (isLoading) return <LoadingState dark message="Calculating preparedness score..." />;
  if (error) return <ErrorState message={error} onRetry={() => loadDashboard()} />;

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={() => loadDashboard(true)} />
      }
    >
      <View style={[styles.darkStage, { paddingTop: insets.top + SPACING.s24 }]}>
        <AtmosphericOrb style={styles.orb} />
        <View style={styles.chip}>
          <Text style={styles.chipText}>{stats?.institution_name || 'Institution'}</Text>
        </View>
        <Text style={styles.heroScore}>{stats?.preparedness_score ?? 0}%</Text>
        <Text style={styles.heroLabel}>
          Campus <Text style={styles.sproutAccent}>Preparedness</Text> Score
        </Text>
      </View>

      <View style={styles.lightBand}>
        <Card variant="light">
          <View style={styles.studentRow}>
            <Text style={styles.metricTitle}>Enrolled Students</Text>
            <View style={styles.sproutPill}>
              <Text style={styles.sproutPillText}>{stats?.total_students ?? 0} active</Text>
            </View>
          </View>

          <View style={styles.metricBlock}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Lesson Completion Rate</Text>
              <Text style={styles.metricValue}>{stats?.lesson_completion_rate ?? 0}%</Text>
            </View>
            <ProgressBar percentage={stats?.lesson_completion_rate ?? 0} />
          </View>

          <View style={styles.metricBlock}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Average Quiz Score</Text>
              <Text style={styles.metricValue}>{stats?.average_quiz_score ?? 0}%</Text>
            </View>
            <ProgressBar percentage={stats?.average_quiz_score ?? 0} />
          </View>

          <View style={styles.metricBlock}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Drill Participation Rate</Text>
              <Text style={styles.metricValue}>{stats?.drill_participation_rate ?? 0}%</Text>
            </View>
            <ProgressBar percentage={stats?.drill_participation_rate ?? 0} />
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.pureWhite },
  scrollContent: { paddingBottom: 112 },
  darkStage: {
    backgroundColor: COLORS.forestDepths,
    paddingHorizontal: SPACING.s24,
    paddingBottom: SPACING.s40,
    overflow: 'hidden',
  },
  orb: { top: -80, right: -90 },
  chip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.lichenSage,
    borderRadius: RADIUS.orb,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: SPACING.s16,
    marginBottom: SPACING.s24,
  },
  chipText: { ...TYPE.caption, color: COLORS.pureWhite },
  heroScore: {
    fontFamily: FONTS.display,
    fontSize: 64,
    lineHeight: 62,
    letterSpacing: -1.5,
    fontWeight: '700',
    color: COLORS.electricSprout,
    marginBottom: SPACING.s8,
  },
  heroLabel: { ...TYPE.heading, color: COLORS.pureWhite },
  sproutAccent: { color: COLORS.electricSprout },
  lightBand: {
    backgroundColor: COLORS.pureWhite,
    paddingHorizontal: SPACING.s24,
    paddingTop: SPACING.s32,
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s24,
  },
  metricTitle: { ...TYPE.headingSm, color: COLORS.onyxOlive },
  sproutPill: {
    backgroundColor: COLORS.sproutWash,
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
  },
  sproutPillText: { fontSize: 12, fontWeight: '500', color: COLORS.mossShadow },
  metricBlock: { marginBottom: SPACING.s16 },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.s8 },
  metricLabel: { ...TYPE.body, color: COLORS.onyxOlive },
  metricValue: { ...TYPE.body, fontWeight: '600', color: COLORS.deepVerdant },
});
