// Admin Preparedness Dashboard fetching institutional analytics from GET /api/v1/dashboard.

import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getDashboardStats } from '../../services/dashboardService';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { COLORS, SPACING } from '../../constants/theme';

export const AdminDashboardScreen = () => {
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

  if (isLoading) return <LoadingState message="Calculating preparedness metrics..." />;
  if (error) return <ErrorState message={error} onRetry={() => loadDashboard()} />;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={() => loadDashboard(true)} />
      }
    >
      <Card style={styles.scoreCard}>
        <Text style={styles.instName}>{stats?.institution_name || 'Institution'}</Text>
        <Text style={styles.scoreValue}>{stats?.preparedness_score ?? 0}%</Text>
        <Text style={styles.scoreLabel}>Overall Preparedness Score</Text>
      </Card>

      <Card>
        <Text style={styles.metricTitle}>Enrolled Students: {stats?.total_students ?? 0}</Text>
        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>
            Lesson Completion Rate: {stats?.lesson_completion_rate ?? 0}%
          </Text>
          <ProgressBar percentage={stats?.lesson_completion_rate ?? 0} />
        </View>
        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>
            Average Quiz Score: {stats?.average_quiz_score ?? 0}%
          </Text>
          <ProgressBar percentage={stats?.average_quiz_score ?? 0} />
        </View>
        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>
            Drill Participation Rate: {stats?.drill_participation_rate ?? 0}%
          </Text>
          <ProgressBar percentage={stats?.drill_participation_rate ?? 0} />
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.md },
  scoreCard: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary, alignItems: 'center' },
  instName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  scoreValue: { fontSize: 40, fontWeight: '900', color: COLORS.primary, marginVertical: SPACING.xs },
  scoreLabel: { fontSize: 13, color: COLORS.textMuted },
  metricTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  metricBlock: { marginBottom: SPACING.md },
  metricLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
});

