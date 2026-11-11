// Virtual drills list screen fetching scenarios from GET /api/v1/drills.

import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text } from 'react-native';
import { getDrills } from '../../services/drillService';
import { Card } from '../../components/Card';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { COLORS, SPACING } from '../../constants/theme';

export const DrillsListScreen = () => {
  const [drills, setDrills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadDrills = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError('');
    try {
      const data = await getDrills();
      setDrills(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDrills();
  }, [loadDrills]);

  if (isLoading) return <LoadingState message="Loading virtual drills..." />;
  if (error) return <ErrorState message={error} onRetry={() => loadDrills()} />;

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.container}
      data={drills}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={() => loadDrills(true)} />
      }
      ListEmptyComponent={<EmptyState title="No virtual drills available" />}
      renderItem={({ item }) => (
        <Card>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.steps}>{item.total_steps} interactive steps</Text>
        </Card>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.md, flexGrow: 1 },
  title: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  steps: { fontSize: 13, color: COLORS.primary, fontWeight: '600', marginTop: SPACING.xs },
});

