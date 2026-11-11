// Modules list screen fetching learning modules from GET /api/v1/modules.

import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { getModules } from '../../services/moduleService';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { COLORS, SPACING } from '../../constants/theme';

export const ModulesListScreen = () => {
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadModules = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError('');
    try {
      const data = await getModules();
      setModules(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  if (isLoading) return <LoadingState message="Loading learning modules..." />;
  if (error) return <ErrorState message={error} onRetry={() => loadModules()} />;

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.container}
      data={modules}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={() => loadModules(true)} />
      }
      ListEmptyComponent={<EmptyState title="No modules available" />}
      renderItem={({ item }) => (
        <Card>
          <View style={styles.topRow}>
            <Text style={styles.type}>{item.disaster_type?.toUpperCase()}</Text>
            <Text style={styles.count}>
              {item.completed_lessons}/{item.total_lessons} lessons
            </Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc}>{item.description}</Text>
          <ProgressBar percentage={item.progress_percentage} />
        </Card>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.md, flexGrow: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  type: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  count: { fontSize: 12, color: COLORS.textMuted },
  title: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  desc: { fontSize: 13, color: COLORS.textMuted, marginBottom: SPACING.sm },
});

