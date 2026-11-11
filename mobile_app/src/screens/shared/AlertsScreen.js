// Shared Alerts screen fetching institution alerts from GET /api/v1/alerts.

import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { getAlerts } from '../../services/alertService';
import { Card } from '../../components/Card';
import { SeverityBadge } from '../../components/SeverityBadge';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { COLORS, SPACING } from '../../constants/theme';

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

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

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
      ListEmptyComponent={
        <EmptyState title="No active alerts" subtitle="Your institution has not posted any alerts yet." />
      }
      renderItem={({ item }) => (
        <Card>
          <View style={styles.header}>
            <SeverityBadge severity={item.severity} />
            <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message}>{item.message}</Text>
        </Card>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.md, flexGrow: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  date: { fontSize: 12, color: COLORS.textMuted },
  title: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  message: { fontSize: 14, color: COLORS.textMuted, lineHeight: 20 },
});

