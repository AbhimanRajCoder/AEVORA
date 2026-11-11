// Institution leaderboard with Forest Depths standing header and Bone White ranking rows.

import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { getLeaderboard } from '../../services/leaderboardService';
import { Card } from '../../components/Card';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { COLORS, FONTS, RADIUS, SPACING, TYPE } from '../../constants/theme';

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
          <Card variant="dark">
            <Text style={styles.myLabel}>YOUR STANDING</Text>
            <View style={styles.myRow}>
              <Text style={styles.myRank}>#{board.current_user.rank}</Text>
              <Text style={styles.myPts}>{board.current_user.points} pts</Text>
            </View>
          </Card>
        ) : null
      }
      ListEmptyComponent={
        <EmptyState title="No ranked students yet" subtitle="Complete quizzes and drills to earn points." />
      }
      renderItem={({ item }) => (
        <Card variant="light" style={styles.rowCard}>
          <View style={styles.row}>
            <Text style={styles.rank}>#{item.rank}</Text>
            <Text style={styles.name}>{item.full_name}</Text>
            <View style={styles.sproutChip}>
              <Text style={styles.pts}>{item.points} pts</Text>
            </View>
          </View>
        </Card>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: COLORS.pureWhite },
  container: { padding: SPACING.s24, paddingBottom: 112, flexGrow: 1 },
  myLabel: { ...TYPE.caption, color: COLORS.paleFern, letterSpacing: 0.8, marginBottom: SPACING.s8 },
  myRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  myRank: { fontFamily: FONTS.display, ...TYPE.display, color: COLORS.electricSprout },
  myPts: { fontFamily: FONTS.serif, fontSize: 20, fontStyle: 'italic', color: COLORS.pureWhite },
  rowCard: { padding: SPACING.s16, marginBottom: SPACING.s8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rank: { width: 40, fontSize: 15, fontWeight: '700', color: COLORS.deepVerdant },
  name: { flex: 1, ...TYPE.bodyMd, color: COLORS.onyxOlive },
  sproutChip: {
    backgroundColor: COLORS.sproutWash,
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
  },
  pts: { fontSize: 12, fontWeight: '500', color: COLORS.mossShadow },
});
