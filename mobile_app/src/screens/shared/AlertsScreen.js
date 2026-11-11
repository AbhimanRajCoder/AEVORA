// Shared Alerts feed with focus refresh, Forest Depths summary header, and formatted timestamps.

import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAlerts } from '../../services/alertService';
import { Card } from '../../components/Card';
import { SeverityBadge } from '../../components/SeverityBadge';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { COLORS, FONTS, SPACING, TYPE } from '../../constants/theme';

const formatTimestamp = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const AlertsHeader = ({ count }) => (
  <Card variant="dark" style={styles.heroCard}>
    <Text style={styles.heroEyebrow}>CAMPUS ADVISORIES</Text>
    <Text style={styles.heroTitle}>
      Active <Text style={styles.heroSerif}>Alerts</Text>
    </Text>
    <Text style={styles.heroSubtitle}>
      {count === 0
        ? 'No institution alerts published right now.'
        : `${count} ${count === 1 ? 'advisory' : 'advisories'} issued for your campus.`}
    </Text>
  </Card>
);

export const AlertsScreen = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadAlerts = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError('');
    try {
      const data = await getAlerts();
      setAlerts(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAlerts();
    }, [loadAlerts])
  );

  if (isLoading) return <LoadingState message="Loading campus alerts..." />;
  if (error) return <ErrorState message={error} onRetry={() => loadAlerts()} />;

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.container}
      data={alerts}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={() => loadAlerts(true)} />
      }
      ListHeaderComponent={<AlertsHeader count={alerts.length} />}
      ListEmptyComponent={
        <EmptyState
          title="No active alerts"
          subtitle="Your institution has not posted any alerts yet."
        />
      }
      renderItem={({ item }) => (
        <Card variant="light">
          <View style={styles.header}>
            <SeverityBadge severity={item.severity} />
            <Text style={styles.date}>{formatTimestamp(item.created_at)}</Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message}>{item.message}</Text>
        </Card>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: COLORS.pureWhite },
  container: { padding: SPACING.s24, paddingBottom: 112, flexGrow: 1 },
  heroCard: { marginBottom: SPACING.s24 },
  heroEyebrow: { ...TYPE.labelCaps, color: COLORS.electricSprout, marginBottom: SPACING.s8 },
  heroTitle: { ...TYPE.headingLg, color: COLORS.pureWhite, marginBottom: SPACING.s8 },
  heroSerif: { fontFamily: FONTS.serif, fontStyle: 'italic', fontWeight: '400' },
  heroSubtitle: { ...TYPE.body, color: COLORS.paleFern },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s16,
  },
  date: {
    fontFamily: FONTS.serif,
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.lichenSage,
  },
  title: { ...TYPE.headingSm, color: COLORS.onyxOlive, marginBottom: SPACING.s8 },
  message: { ...TYPE.body, color: COLORS.lichenSage },
});
