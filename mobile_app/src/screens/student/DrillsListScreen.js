// Virtual drills list screen in Pure White & Bone White with Sprout Wash step chips.

import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { getDrills } from '../../services/drillService';
import { Card } from '../../components/Card';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { COLORS, FONTS, RADIUS, SPACING, TYPE } from '../../constants/theme';

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
      renderItem={({ item, index }) => (
        <Card variant="light">
          <View style={styles.topRow}>
            <View style={styles.sproutChip}>
              <Text style={styles.chipText}>{item.total_steps} steps</Text>
            </View>
            <Text style={styles.serifIndex}>Scenario 0{index + 1}</Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>
        </Card>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: COLORS.pureWhite },
  container: { padding: SPACING.s24, paddingBottom: 112, flexGrow: 1 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s16,
  },
  sproutChip: {
    backgroundColor: COLORS.sproutWash,
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
  },
  chipText: { fontSize: 12, fontWeight: '500', color: COLORS.mossShadow },
  serifIndex: {
    fontFamily: FONTS.serif,
    fontSize: 15,
    fontStyle: 'italic',
    color: COLORS.lichenSage,
  },
  title: { ...TYPE.headingSm, color: COLORS.onyxOlive },
});
