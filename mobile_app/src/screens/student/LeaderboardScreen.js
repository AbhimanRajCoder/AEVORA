// Institution leaderboard with pinned Forest Depths standing card and highlighted top 3 ranks.

import { SearchField, FilterRow } from '../../components/ListControls';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getLeaderboard } from '../../services/leaderboardService';
import { AtmosphericOrb } from '../../components/AtmosphericOrb';
import { Card } from '../../components/Card';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { COLORS, FONTS, RADIUS, SPACING, TYPE } from '../../constants/theme';

const TOP_LABELS = { 1: '1st', 2: '2nd', 3: '3rd' };

// Renders the pinned Forest Depths standing banner above the ranked list.
const PinnedStandingCard = ({ currentUser, totalStudents }) => {
  const countLabel = `${totalStudents} ${totalStudents === 1 ? 'student' : 'students'} ranked`;

  return (
    <View style={styles.pinnedStage}>
      <AtmosphericOrb style={styles.orb} />
      <View style={styles.pinnedTopRow}>
        <Text style={styles.eyebrow}>
          {currentUser ? 'YOUR STANDING' : 'CAMPUS STANDING'}
        </Text>
        <View style={styles.countPill}>
          <Text style={styles.countText}>{countLabel}</Text>
        </View>
      </View>
      {currentUser ? (
        <View style={styles.myRow}>
          <View>
            <Text style={styles.myRank}>#{currentUser.rank}</Text>
            <Text style={styles.myName} numberOfLines={1}>
              {currentUser.full_name}
            </Text>
          </View>
          <Text style={styles.myPts}>{currentUser.points} pts</Text>
        </View>
      ) : (
        <Text style={styles.noStandingText}>
          No student standing assigned to this account.
        </Text>
      )}
    </View>
  );
};

// Renders a leaderboard entry card with visual emphasis for top 3 ranks and current user.
const LeaderboardRow = ({ item, isCurrentUser }) => {
  const isFirst = item.rank === 1;
  const isTopThree = item.rank <= 3;

  return (
    <Card
      variant="light"
      style={[
        styles.rowCard,
        isTopThree && styles.topThreeCard,
        isFirst && styles.firstCard,
        isCurrentUser && !isTopThree && styles.currentUserCard,
      ]}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.rankBadge,
            isTopThree && styles.rankBadgeTop,
            isFirst && styles.rankBadgeFirst,
          ]}
        >
          <Text
            style={[
              styles.rankText,
              isTopThree && styles.rankTextTop,
              isFirst && styles.rankTextFirst,
            ]}
          >
            #{item.rank}
          </Text>
        </View>

        <View style={styles.nameBlock}>
          <View style={styles.nameLine}>
            <Text style={[styles.name, isFirst && styles.nameFirst]} numberOfLines={1}>
              {item.full_name}
            </Text>
            {isCurrentUser ? (
              <View style={styles.youBadge}>
                <Text style={styles.youText}>YOU</Text>
              </View>
            ) : null}
          </View>
          {isTopThree ? (
            <Text style={styles.podiumLabel}>{TOP_LABELS[item.rank]} place</Text>
          ) : null}
        </View>

        <View style={[styles.ptsChip, isFirst && styles.ptsChipFirst]}>
          <Text style={[styles.pts, isFirst && styles.ptsFirst]}>{item.points} pts</Text>
        </View>
      </View>
    </Card>
  );
};

// Displays top 20 students for the user's institution with pull-to-refresh and focus updates.
export const LeaderboardScreen = () => {
  const [limit, setLimit] = React.useState('20');
  const [board, setBoard] = useState({ leaderboard: [], current_user: null, total_students: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadLeaderboard = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError('');
    try {
      const data = await getLeaderboard(Number(limit));
      setBoard(data || { leaderboard: [], current_user: null, total_students: 0 });
    } catch (err) {
      setError(err.message || 'Unable to load campus leaderboard.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [limit]);

  useFocusEffect(
    useCallback(() => {
      loadLeaderboard();
    }, [loadLeaderboard])
  );

  if (isLoading) return <LoadingState message="Loading leaderboard..." />;
  if (error) return <ErrorState message={error} onRetry={() => loadLeaderboard()} />;

  const entries = board.leaderboard || [];
  const totalStudents = board.total_students ?? entries.length;
  const currentUserId = board.current_user?.id;

  return (
    <View style={styles.screen}>
      <PinnedStandingCard currentUser={board.current_user} totalStudents={totalStudents} />
      <FilterRow value={limit} options={['10', '20', '50']} onChange={setLimit} />
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.container}
        data={entries}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => loadLeaderboard(true)} />
        }
        ListHeaderComponent={
          entries.length > 0 ? (
            <Text style={styles.sectionHeading}>
              Top <Text style={styles.accent}>Students</Text>
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            title="No ranked students yet"
            subtitle="Complete quizzes and drills to earn points."
          />
        }
        renderItem={({ item }) => (
          <LeaderboardRow item={item} isCurrentUser={item.id === currentUserId} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.pureWhite },
  pinnedStage: {
    backgroundColor: COLORS.forestDepths,
    paddingHorizontal: SPACING.s24,
    paddingTop: SPACING.s16,
    paddingBottom: SPACING.s24,
    overflow: 'hidden',
  },
  orb: { top: -110, right: -100 },
  pinnedTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s12,
  },
  eyebrow: { ...TYPE.labelCaps, color: COLORS.electricSprout },
  countPill: {
    borderWidth: 1,
    borderColor: COLORS.lichenSage,
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
  },
  countText: { fontSize: 12, fontWeight: '500', color: COLORS.pureWhite },
  myRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  myRank: { fontFamily: FONTS.display, ...TYPE.display, color: COLORS.electricSprout },
  myName: { ...TYPE.caption, color: COLORS.paleFern, marginTop: 2 },
  myPts: { fontFamily: FONTS.serif, fontSize: 22, fontStyle: 'italic', color: COLORS.pureWhite },
  noStandingText: { ...TYPE.body, color: COLORS.paleFern },
  list: { flex: 1, backgroundColor: COLORS.pureWhite },
  container: { padding: SPACING.s24, paddingBottom: SPACING.s48, flexGrow: 1 },
  sectionHeading: { ...TYPE.heading, color: COLORS.onyxOlive, marginBottom: SPACING.s16 },
  accent: { color: COLORS.deepVerdant },
  rowCard: { padding: SPACING.s16, marginBottom: SPACING.s12 },
  topThreeCard: { backgroundColor: COLORS.sproutWash, borderColor: COLORS.mistGreen },
  firstCard: { borderColor: COLORS.deepVerdant },
  currentUserCard: { borderColor: COLORS.deepVerdant },
  row: { flexDirection: 'row', alignItems: 'center' },
  rankBadge: {
    minWidth: 42,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: RADIUS.badge,
    backgroundColor: COLORS.pureWhite,
    borderWidth: 1,
    borderColor: COLORS.mistGreen,
    alignItems: 'center',
    marginRight: SPACING.s12,
  },
  rankBadgeTop: { backgroundColor: COLORS.forestDepths, borderColor: COLORS.forestDepths },
  rankBadgeFirst: { backgroundColor: COLORS.electricSprout, borderColor: COLORS.electricSprout },
  rankText: { fontSize: 13, fontWeight: '700', color: COLORS.lichenSage },
  rankTextTop: { color: COLORS.electricSprout },
  rankTextFirst: { color: COLORS.carbon },
  nameBlock: { flex: 1, marginRight: SPACING.s8 },
  nameLine: { flexDirection: 'row', alignItems: 'center', gap: SPACING.s8 },
  name: { ...TYPE.bodyMd, fontWeight: '500', color: COLORS.onyxOlive, flexShrink: 1 },
  nameFirst: { fontWeight: '700', color: COLORS.forestDepths },
  youBadge: {
    backgroundColor: COLORS.forestDepths,
    borderRadius: RADIUS.badge,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  youText: { fontSize: 10, fontWeight: '700', color: COLORS.electricSprout },
  podiumLabel: {
    fontFamily: FONTS.serif,
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.deepVerdant,
    marginTop: 2,
  },
  ptsChip: {
    backgroundColor: COLORS.sproutWash,
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
  },
  ptsChipFirst: { backgroundColor: COLORS.forestDepths },
  pts: { fontSize: 12, fontWeight: '600', color: COLORS.mossShadow },
  ptsFirst: { color: COLORS.electricSprout },
});
