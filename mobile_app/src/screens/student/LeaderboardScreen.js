// Institution leaderboard screen fetching student rankings from GET /api/v1/leaderboard.

import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { getLeaderboard } from '../../services/leaderboardService';
import { Card } from '../../components/Card';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { COLORS, SPACING } from '../../constants/theme';

export const LeaderboardScreen = () => {
  const [board, setBoard] = useState({ leaderboard: [], current_user: null, total_students: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadLeaderboard = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError('');
    try {
      const data = await getLeaderboard(20);
      setBoard(data || { leaderboard: [], current_user: null, total_students: 0 });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  if (isLoading) return <LoadingState message="Loading leaderboard..." />;
  if (error) return <ErrorState message={error} onRetry={() => loadLeaderboard()} />;

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.container}
      data={board.leaderboard || []}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={() => loadLeaderboard(true)} />
      }
      ListHeaderComponent={
        board.current_user ? (
          <Card style={styles.myCard}>
            <Text style={styles.myLabel}>Your Standing</Text>
            <Text style={styles.myRank}>
              Rank #{board.current_user.rank} · {board.current_user.points} pts
            </Text>
          </Card>
        ) : null
      }
      ListEmptyComponent={
        <EmptyState title="No ranked students yet" subtitle="Complete quizzes and drills to earn points." />
      }
      renderItem={({ item }) => (
        <Card style={styles.rowCard}>
          <View style={styles.row}>
            <Text style={styles.rank}>#{item.rank}</Text>
            <Text style={styles.name}>{item.full_name}</Text>
            <Text style={styles.pts}>{item.points} pts</Text>
          </View>
        </Card>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.md, flexGrow: 1 },
  myCard: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  myLabel: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  myRank: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginTop: 2 },
  rowCard: { marginBottom: SPACING.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  rank: { width: 40, fontSize: 15, fontWeight: '800', color: COLORS.primary },
  name: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text },
  pts: { fontSize: 14, fontWeight: '700', color: COLORS.textMuted },
});

