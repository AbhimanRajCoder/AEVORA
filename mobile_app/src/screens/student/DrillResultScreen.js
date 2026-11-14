// Drill result screen showing score, points awarded, expandable step review, and retry actions.

import { SearchField, FilterRow } from '../../components/ListControls';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AtmosphericOrb } from '../../components/AtmosphericOrb';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { EmptyState } from '../../components/EmptyState';
import { COLORS, FONTS, RADIUS, SPACING, TYPE } from '../../constants/theme';

// Renders the Forest Depths hero summary with percentage score, points ratio, and CTAs.
const DrillResultHero = ({
  title,
  score,
  totalEarned,
  maxPoints,
  pointsAwarded,
  onTryAgain,
  onAllDrills,
}) => {
  const isStrong = score >= 70;
  return (
    <View style={styles.darkStage}>
      <AtmosphericOrb style={styles.orb} />
      <View style={[styles.statusPill, isStrong ? styles.statusPillPass : styles.statusPillNote]}>
        <Text
          style={[styles.statusPillText, isStrong ? styles.statusTextPass : styles.statusTextNote]}
        >
          {isStrong ? '✓ DRILL COMPLETED' : 'DRILL REVIEW READY'}
        </Text>
      </View>
      {title ? <Text style={styles.drillLabel}>{title}</Text> : null}
      <Text style={[styles.scoreValue, !isStrong && styles.scoreValueMuted]}>{score}%</Text>
      <Text style={styles.summaryText}>
        {totalEarned} / {maxPoints} scenario points earned
      </Text>
      <View style={styles.pointsBanner}>
        {pointsAwarded > 0 ? (
          <Text style={styles.pointsEarnedText}>
            +{pointsAwarded} pts awarded to your campus profile!
          </Text>
        ) : (
          <Text style={styles.pointsNoteText}>
            0 new points awarded (first-attempt drill score already recorded).
          </Text>
        )}
      </View>
      <View style={styles.heroActions}>
        <PrimaryButton
          label="Try Again"
          variant={isStrong ? 'outlineDark' : 'sprout'}
          onPress={onTryAgain}
          style={styles.heroBtn}
        />
        <PrimaryButton
          label="All Drills"
          variant={isStrong ? 'sprout' : 'outlineDark'}
          onPress={onAllDrills}
          style={styles.heroBtn}
        />
      </View>
    </View>
  );
};

// Renders an expandable step-by-step review card with points earned and feedback.
const StepReviewCard = ({ item, isExpanded, onToggle }) => {
  const stepNum = String(item.step ?? 0).padStart(2, '0');
  const isFullScore = item.points_earned >= item.max_points && item.max_points > 0;

  return (
    <Pressable onPress={onToggle} accessibilityRole="button">
      <Card variant="light">
        <View style={styles.reviewTop}>
          <Text style={styles.serifIndex}>Step {stepNum}</Text>
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.itemBadge,
                isFullScore ? styles.itemBadgeBest : styles.itemBadgePartial,
              ]}
            >
              <Text
                style={[
                  styles.itemBadgeText,
                  isFullScore ? styles.itemTextBest : styles.itemTextPartial,
                ]}
              >
                {item.points_earned} / {item.max_points} pts
              </Text>
            </View>
            <Text style={styles.chevron}>{isExpanded ? '−' : '+'}</Text>
          </View>
        </View>
        <Text style={styles.scenarioText} numberOfLines={isExpanded ? undefined : 2}>
          {item.scenario}
        </Text>
        {isExpanded ? (
          <View style={styles.expandedBody}>
            <View style={styles.actionRow}>
              <Text style={styles.actionLabel}>Your action</Text>
              <Text style={styles.actionValue}>{item.selected_action || 'No action selected'}</Text>
            </View>
            <View style={[styles.feedbackBox, isFullScore && styles.feedbackBoxBest]}>
              <Text style={[styles.feedbackLabel, isFullScore && styles.feedbackLabelBest]}>
                Feedback
              </Text>
              <Text style={[styles.feedbackText, isFullScore && styles.feedbackTextBest]}>
                {item.feedback}
              </Text>
            </View>
          </View>
        ) : null}
      </Card>
    </Pressable>
  );
};

// Displays virtual drill grading results and step-by-step feedback review.
export const DrillResultScreen = ({ route, navigation }) => {
  const { result, drillId, title } = route.params || {};
  const [view, setView] = React.useState('All steps');
  const review = result?.review || [];
  const targetDrillId = drillId || result?.scenario_id;
  const drillTitle = result?.title || title || 'Virtual Drill';

  const [expandedSteps, setExpandedSteps] = useState(() => {
    const initial = {};
    review.forEach((item, idx) => {
      if (idx === 0 || item.points_earned < item.max_points) {
        initial[item.step ?? idx] = true;
      }
    });
    return initial;
  });

  const allExpanded = review.length > 0 && review.every((item, idx) => expandedSteps[item.step ?? idx]);

  const toggleStep = (stepKey) => {
    setExpandedSteps((prev) => ({ ...prev, [stepKey]: !prev[stepKey] }));
  };

  const toggleAllSteps = () => {
    if (allExpanded) {
      setExpandedSteps({});
      return;
    }
    const next = {};
    review.forEach((item, idx) => {
      next[item.step ?? idx] = true;
    });
    setExpandedSteps(next);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <DrillResultHero
        title={drillTitle}
        score={result?.score ?? 0}
        totalEarned={result?.total_points_earned ?? 0}
        maxPoints={result?.max_possible_points ?? 0}
        pointsAwarded={result?.points_awarded ?? 0}
        onTryAgain={() =>
          navigation.replace('DrillSimulation', { drillId: targetDrillId, title: drillTitle })
        }
        onAllDrills={() => navigation.popToTop()}
      />
      <View style={styles.lightBand}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeading}>
            Step <Text style={styles.accent}>Review</Text>
          </Text>
          {review.length > 0 ? (
            <Pressable onPress={toggleAllSteps}>
              <Text style={styles.toggleAllText}>
                {allExpanded ? 'Collapse all' : 'Expand all'}
              </Text>
            </Pressable>
          ) : null}
        </View>
        <FilterRow value={view} options={['All steps', 'Practice again']} onChange={setView} />
        {view === "Practice again" && review.every(item => item.points_earned >= item.max_points) && <Text>No steps to revisit.</Text>}
        {review.length === 0 ? (
          <EmptyState title="No step review available" />
        ) : (
          review.map((item, idx) => {
            if (view === "Practice again" && item.points_earned >= item.max_points) return null;
            const stepKey = item.step ?? idx;
            return (
              <StepReviewCard
                key={String(stepKey)}
                item={item}
                isExpanded={Boolean(expandedSteps[stepKey])}
                onToggle={() => toggleStep(stepKey)}
              />
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.pureWhite },
  container: { paddingBottom: SPACING.s48 },
  darkStage: {
    backgroundColor: COLORS.forestDepths,
    paddingHorizontal: SPACING.s24,
    paddingTop: SPACING.s24,
    paddingBottom: SPACING.s32,
    overflow: 'hidden',
  },
  orb: { top: -90, right: -100 },
  statusPill: {
    alignSelf: 'flex-start',
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
    borderWidth: 1,
    marginBottom: SPACING.s16,
  },
  statusPillPass: { backgroundColor: COLORS.electricSprout, borderColor: COLORS.electricSprout },
  statusPillNote: { backgroundColor: 'transparent', borderColor: COLORS.lichenSage },
  statusPillText: { fontSize: 11, fontWeight: '600' },
  statusTextPass: { color: COLORS.carbon },
  statusTextNote: { color: COLORS.pureWhite },
  drillLabel: { ...TYPE.caption, color: COLORS.paleFern, marginBottom: SPACING.s8 },
  scoreValue: {
    fontFamily: FONTS.display,
    fontSize: 64,
    lineHeight: 62,
    letterSpacing: -1.5,
    fontWeight: '700',
    color: COLORS.electricSprout,
  },
  scoreValueMuted: { color: COLORS.pureWhite },
  summaryText: { ...TYPE.bodyMd, color: COLORS.paleFern, marginTop: SPACING.s8, marginBottom: SPACING.s16 },
  pointsBanner: {
    borderWidth: 1,
    borderColor: COLORS.onyxOlive,
    borderRadius: RADIUS.card,
    padding: SPACING.s16,
    marginBottom: SPACING.s24,
  },
  pointsEarnedText: { ...TYPE.body, fontWeight: '600', color: COLORS.electricSprout },
  pointsNoteText: { ...TYPE.body, color: COLORS.paleFern },
  heroActions: { flexDirection: 'row', gap: SPACING.s16 },
  heroBtn: { flex: 1 },
  lightBand: { backgroundColor: COLORS.pureWhite, paddingHorizontal: SPACING.s24, paddingTop: SPACING.s32 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s16,
  },
  sectionHeading: { ...TYPE.heading, color: COLORS.onyxOlive },
  accent: { color: COLORS.deepVerdant },
  toggleAllText: { ...TYPE.caption, fontWeight: '600', color: COLORS.deepVerdant },
  reviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s8,
  },
  serifIndex: { fontFamily: FONTS.serif, fontSize: 14, fontStyle: 'italic', color: COLORS.lichenSage },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.s8 },
  itemBadge: {
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  itemBadgeBest: { backgroundColor: COLORS.sproutWash, borderColor: COLORS.mistGreen },
  itemBadgePartial: { backgroundColor: COLORS.forestDepths, borderColor: COLORS.onyxOlive },
  itemBadgeText: { fontSize: 11, fontWeight: '600' },
  itemTextBest: { color: COLORS.mossShadow },
  itemTextPartial: { color: COLORS.pureWhite },
  chevron: { fontSize: 16, fontWeight: '600', color: COLORS.lichenSage, width: 16, textAlign: 'center' },
  scenarioText: { ...TYPE.headingSm, color: COLORS.onyxOlive },
  expandedBody: { marginTop: SPACING.s12 },
  actionRow: { borderTopWidth: 1, borderTopColor: COLORS.mistGreen, paddingTop: SPACING.s8 },
  actionLabel: { ...TYPE.caption, color: COLORS.lichenSage, marginBottom: 4 },
  actionValue: { ...TYPE.body, color: COLORS.onyxOlive },
  feedbackBox: {
    backgroundColor: COLORS.pureWhite,
    borderWidth: 1,
    borderColor: COLORS.mistGreen,
    borderRadius: RADIUS.buttonCompact,
    padding: SPACING.s16,
    marginTop: SPACING.s12,
  },
  feedbackBoxBest: { backgroundColor: COLORS.sproutWash, borderColor: COLORS.mistGreen },
  feedbackLabel: { ...TYPE.caption, fontWeight: '600', color: COLORS.onyxOlive, marginBottom: 4 },
  feedbackLabelBest: { color: COLORS.mossShadow },
  feedbackText: { ...TYPE.body, color: COLORS.onyxOlive },
  feedbackTextBest: { color: COLORS.mossShadow },
});
