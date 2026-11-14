// Student Home with live focus refresh, Forest Depths hero stage, alert spotlight, and quick actions.

import React, { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { getModules } from '../../services/moduleService';
import { getAlerts } from '../../services/alertService';
import { AtmosphericOrb } from '../../components/AtmosphericOrb';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { SeverityBadge } from '../../components/SeverityBadge';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { COLORS, FONTS, RADIUS, SPACING, TYPE } from '../../constants/theme';

const getInitials = (fullName = 'Student') => {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'S';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export const StudentHomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, refreshUser } = useAuth();
  const [modules, setModules] = useState([]);
  const [latestAlert, setLatestAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadHomeData = useCallback(
    async (refresh = false) => {
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError('');
      try {
        const [modulesRes, alertsRes] = await Promise.all([
          getModules(),
          getAlerts(),
          refreshUser().catch(() => null),
        ]);
        setModules(modulesRes || []);
        setLatestAlert(alertsRes && alertsRes.length > 0 ? alertsRes[0] : null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [refreshUser]
  );

  useFocusEffect(
    useCallback(() => {
      loadHomeData();
    }, [loadHomeData])
  );

  if (isLoading) return <LoadingState dark message="Loading workspace..." />;
  if (error) return <ErrorState message={error} onRetry={() => loadHomeData()} />;

  const resume = modules.find(item => item.completed_lessons > 0 && !item.is_completed);
  const completedModules = modules.filter((m) => m.is_completed).length;
  const overallProgress =
    modules.length > 0
      ? Math.round(modules.reduce((sum, m) => sum + (m.progress_percentage || 0), 0) / modules.length)
      : 0;

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={() => loadHomeData(true)} />
      }
    >
      <View style={[styles.darkStage, { paddingTop: insets.top + SPACING.s24 }]}>
        <AtmosphericOrb style={styles.orb} />

        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <Text style={styles.brandWordmark}>aevora</Text>
            <Pressable
              onPress={() => navigation.navigate('Leaderboard')}
              style={({ pressed }) => [styles.pointsTag, pressed && styles.pressed]}
            >
              <Text style={styles.pointsTagText}>{user?.points ?? 0} PTS</Text>
            </Pressable>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Profile')}
            style={({ pressed }) => [styles.profileButton, pressed && styles.pressed]}
          >
            <View style={styles.avatarDot}>
              <Text style={styles.avatarInitials}>{getInitials(user?.full_name)}</Text>
            </View>
            <Text style={styles.profileButtonText}>Profile</Text>
          </Pressable>
        </View>

        <Text style={styles.heroHeadline}>Student dashboard</Text>
        <Text style={styles.heroSubcopy}>
          Welcome back, {user?.full_name || 'Student'}. Track modules and practice drills.
        </Text>

        {modules.length > 0 && completedModules === modules.length && <PrimaryButton label="Practice a drill"
          onPress={() => navigation.navigate('Drills')} />}
        <Card variant="floating" style={styles.floatingCard}>
          <View style={styles.floatingTop}>
            <View style={styles.sproutChip}>
              <Text style={styles.sproutChipText}>Readiness</Text>
            </View>
            <Text style={styles.serifNote}>progress</Text>
          </View>
          <Text style={styles.floatingPercent}>{overallProgress}%</Text>
          <ProgressBar percentage={overallProgress} />
          <Text style={styles.floatingCaption}>
            {completedModules} of {modules.length} learning modules completed
          </Text>
        </Card>
      </View>

      <View style={styles.lightBand}>
        <Pressable
          onPress={() => navigation.navigate('Alerts')}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          {latestAlert ? (
            <Card variant="light">
              <View style={styles.alertRow}>
                <SeverityBadge severity={latestAlert.severity} />
                <Text style={styles.viewAllLink}>View all alerts →</Text>
              </View>
              <Text style={styles.cardTitle}>{latestAlert.title}</Text>
              <Text style={styles.cardBody} numberOfLines={2}>
                {latestAlert.message}
              </Text>
            </Card>
          ) : (
            <Card variant="light">
              <View style={styles.alertRow}>
                <View style={styles.sproutChip}>
                  <Text style={styles.sproutChipText}>CAMPUS ALERTS</Text>
                </View>
                <Text style={styles.viewAllLink}>Alerts →</Text>
              </View>
              <Text style={styles.cardTitle}>No campus alerts posted</Text>
              <Text style={styles.cardBody}>
                Tap here anytime to view published institution safety advisories.
              </Text>
            </Card>
          )}
        </Pressable>

        {resume && <Pressable accessibilityRole="button" onPress={() => navigation.navigate('ModuleDetail', { moduleId: resume.id })}>
          <Card><Text style={styles.cardTitle}>Continue learning</Text><Text style={styles.cardBody}>{resume.title}</Text></Card>
        </Pressable>}
        <Text style={styles.sectionHeading}>
          Quick <Text style={styles.deepVerdantAccent}>actions</Text>
        </Text>

        <View style={styles.grid}>
          <Pressable
            style={({ pressed }) => [styles.gridCard, pressed && styles.pressed]}
            onPress={() => navigation.navigate('Modules')}
          >
            <View style={styles.sproutChip}>
              <Text style={styles.sproutChipText}>Learn</Text>
            </View>
            <Text style={styles.gridTitle}>Modules</Text>
            <Text style={styles.gridSub}>{modules.length} safety courses</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.gridCard, pressed && styles.pressed]}
            onPress={() => navigation.navigate('Drills')}
          >
            <View style={styles.sproutChip}>
              <Text style={styles.sproutChipText}>Practice</Text>
            </View>
            <Text style={styles.gridTitle}>Virtual Drills</Text>
            <Text style={styles.gridSub}>Interactive scenarios</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.gridCard, pressed && styles.pressed]}
            onPress={() => navigation.navigate('Leaderboard')}
          >
            <View style={styles.sproutChip}>
              <Text style={styles.sproutChipText}>03 · Rank</Text>
            </View>
            <Text style={styles.gridTitle}>Leaderboard</Text>
            <Text style={styles.gridSub}>Campus standings</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.gridCard, pressed && styles.pressed]}
            onPress={() => navigation.navigate('Emergency')}
          >
            <View style={styles.sproutChip}>
              <Text style={styles.sproutChipText}>04 · SOS</Text>
            </View>
            <Text style={styles.gridTitle}>Helplines</Text>
            <Text style={styles.gridSub}>112 & campus desk</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.pureWhite },
  scrollContent: { paddingBottom: 112 },
  pressed: { opacity: 0.85 },
  darkStage: {
    backgroundColor: COLORS.forestDepths,
    paddingHorizontal: SPACING.s24,
    paddingBottom: SPACING.s40,
    overflow: 'hidden',
  },
  orb: { top: -80, right: -100 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.s32,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.s8 },
  brandWordmark: { fontSize: 20, fontWeight: '700', color: COLORS.pureWhite, letterSpacing: -0.5 },
  pointsTag: {
    backgroundColor: COLORS.electricSprout,
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
  },
  pointsTagText: { fontSize: 11, fontWeight: '600', color: COLORS.onyxOlive },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.lichenSage,
    borderRadius: RADIUS.pill,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: SPACING.s12,
  },
  avatarDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.electricSprout,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: { fontSize: 10, fontWeight: '700', color: COLORS.carbon },
  profileButtonText: { fontSize: 13, fontWeight: '500', color: COLORS.pureWhite },
  heroHeadline: { fontFamily: FONTS.display, ...TYPE.displayHero, color: COLORS.pureWhite, marginBottom: SPACING.s16 },
  sproutAccent: { color: COLORS.electricSprout },
  heroSubcopy: { ...TYPE.bodyMd, color: COLORS.paleFern, marginBottom: SPACING.s24 },
  floatingCard: { transform: [{ rotate: '-1.5deg' }], marginBottom: 0 },
  floatingTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s8,
  },
  sproutChip: {
    backgroundColor: COLORS.sproutWash,
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  sproutChipText: { fontSize: 12, fontWeight: '500', color: COLORS.mossShadow },
  serifNote: { fontFamily: FONTS.serif, fontSize: 16, fontStyle: 'italic', color: COLORS.lichenSage },
  floatingPercent: { ...TYPE.headingLg, color: COLORS.onyxOlive, marginBottom: SPACING.s8 },
  floatingCaption: { ...TYPE.caption, color: COLORS.lichenSage, marginTop: SPACING.s8 },
  lightBand: { backgroundColor: COLORS.pureWhite, paddingHorizontal: SPACING.s24, paddingTop: SPACING.s32 },
  alertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s8,
  },
  viewAllLink: { ...TYPE.caption, color: COLORS.deepVerdant, fontWeight: '600' },
  cardTitle: { ...TYPE.headingSm, color: COLORS.onyxOlive, marginBottom: SPACING.s8 },
  cardBody: { ...TYPE.body, color: COLORS.lichenSage },
  sectionHeading: { ...TYPE.heading, color: COLORS.onyxOlive, marginTop: SPACING.s8, marginBottom: SPACING.s16 },
  deepVerdantAccent: { color: COLORS.deepVerdant },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridCard: {
    width: '48%',
    backgroundColor: COLORS.boneWhite,
    borderWidth: 1,
    borderColor: COLORS.mistGreen,
    borderRadius: RADIUS.card,
    padding: SPACING.s16,
    marginBottom: SPACING.s16,
  },
  gridTitle: {
    ...TYPE.subheading,
    fontWeight: '600',
    color: COLORS.onyxOlive,
    marginTop: SPACING.s16,
    marginBottom: 4,
  },
  gridSub: { ...TYPE.caption, color: COLORS.lichenSage },
});
