// Quiz result screen displaying score, pass/fail status, reward points, and full answer review.

import { SearchField, FilterRow } from '../../components/ListControls';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AtmosphericOrb } from '../../components/AtmosphericOrb';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { EmptyState } from '../../components/EmptyState';
import { COLORS, FONTS, RADIUS, SPACING, TYPE } from '../../constants/theme';

export const QuizResultScreen = ({ route, navigation }) => {
  const { result, moduleId, moduleTitle } = route.params || {};

  const [view, setView] = React.useState('All answers');
  const score = result?.score ?? 0;
  const correctCount = result?.correct_count ?? 0;
  const totalQuestions = result?.total_questions ?? 0;
  const passingThreshold = result?.passing_threshold ?? 60;
  const isPassed = Boolean(result?.is_passed);
  const pointsAwarded = result?.points_awarded ?? 0;
  const review = result?.review || [];
  const targetModuleId = moduleId || result?.module_id;

  const handleRetryQuiz = () => {
    navigation.replace('Quiz', {
      moduleId: targetModuleId,
      moduleTitle,
    });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Band 1: Forest Depths Result Stage */}
      <View style={styles.darkStage}>
        <AtmosphericOrb style={styles.orb} />

        <View style={[styles.statusPill, isPassed ? styles.statusPillPass : styles.statusPillFail]}>
          <Text
            style={[
              styles.statusPillText,
              isPassed ? styles.statusPillTextPass : styles.statusPillTextFail,
            ]}
          >
            {isPassed
              ? `✓ PASSED (${passingThreshold}% REQUIRED)`
              : `BELOW ${passingThreshold}% THRESHOLD`}
          </Text>
        </View>

        {moduleTitle ? <Text style={styles.moduleLabel}>{moduleTitle}</Text> : null}

        <Text style={[styles.scoreValue, !isPassed && styles.scoreValueFail]}>{score}%</Text>
        <Text style={styles.summaryText}>
          {correctCount} of {totalQuestions} answers correct
        </Text>

        <View style={styles.pointsBanner}>
          {pointsAwarded > 0 ? (
            <Text style={styles.pointsEarnedText}>
              +{pointsAwarded} pts awarded to your campus profile!
            </Text>
          ) : isPassed ? (
            <Text style={styles.pointsNoteText}>
              Previously passed — 0 duplicate points awarded.
            </Text>
          ) : (
            <Text style={styles.pointsNoteText}>
              Score {passingThreshold}% or higher to earn 50 reward points.
            </Text>
          )}
        </View>

        <View style={styles.heroActions}>
          <PrimaryButton
            label="Retry Quiz"
            variant={isPassed ? 'outlineDark' : 'sprout'}
            onPress={handleRetryQuiz}
            style={styles.heroBtn}
          />
          <PrimaryButton
            label="Back to Module"
            variant={isPassed ? 'sprout' : 'outlineDark'}
            onPress={() => navigation.goBack()}
            style={styles.heroBtn}
          />
        </View>
      </View>

      {/* Band 2: Pure White Answer Review */}
      <View style={styles.lightBand}>
        <Text style={styles.sectionHeading}>
          Answer <Text style={styles.accent}>Review</Text>
        </Text>

        <FilterRow value={view} options={['All answers', 'Missed answers']} onChange={setView} />
        {view === "Missed answers" && review.every(item => item.is_correct) && <Text>No missed answers.</Text>}
        {review.length === 0 ? (
          <EmptyState title="No review items available" />
        ) : (
          review.map((item, index) => view === "Missed answers" && item.is_correct ? null : (
            <Card key={item.question_id || String(index)} variant="light">
              <View style={styles.reviewTop}>
                <Text style={styles.serifIndex}>Question {String(index + 1).padStart(2, '0')}</Text>
                <View
                  style={[
                    styles.itemBadge,
                    item.is_correct ? styles.itemBadgeCorrect : styles.itemBadgeWrong,
                  ]}
                >
                  <Text
                    style={[
                      styles.itemBadgeText,
                      item.is_correct ? styles.itemBadgeTextCorrect : styles.itemBadgeTextWrong,
                    ]}
                  >
                    {item.is_correct ? '✓ CORRECT' : '✕ INCORRECT'}
                  </Text>
                </View>
              </View>

              <Text style={styles.questionText}>{item.question}</Text>

              <View style={styles.answerRow}>
                <Text style={styles.answerLabel}>Your answer</Text>
                <Text style={styles.answerValue}>
                  {item.selected_answer || 'No answer selected'}
                </Text>
              </View>

              {!item.is_correct ? (
                <View style={styles.correctBox}>
                  <Text style={styles.correctLabel}>Correct answer</Text>
                  <Text style={styles.correctValue}>{item.correct_answer}</Text>
                </View>
              ) : null}
            </Card>
          ))
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
  statusPillPass: {
    backgroundColor: COLORS.electricSprout,
    borderColor: COLORS.electricSprout,
  },
  statusPillFail: {
    backgroundColor: 'transparent',
    borderColor: COLORS.lichenSage,
  },
  statusPillText: { fontSize: 11, fontWeight: '600' },
  statusPillTextPass: { color: COLORS.carbon },
  statusPillTextFail: { color: COLORS.pureWhite },
  moduleLabel: { ...TYPE.caption, color: COLORS.paleFern, marginBottom: SPACING.s8 },
  scoreValue: {
    fontFamily: FONTS.display,
    fontSize: 64,
    lineHeight: 62,
    letterSpacing: -1.5,
    fontWeight: '700',
    color: COLORS.electricSprout,
  },
  scoreValueFail: {
    color: COLORS.pureWhite,
  },
  summaryText: {
    ...TYPE.bodyMd,
    color: COLORS.paleFern,
    marginTop: SPACING.s8,
    marginBottom: SPACING.s16,
  },
  pointsBanner: {
    borderWidth: 1,
    borderColor: COLORS.onyxOlive,
    borderRadius: RADIUS.card,
    padding: SPACING.s16,
    marginBottom: SPACING.s24,
  },
  pointsEarnedText: {
    ...TYPE.body,
    fontWeight: '600',
    color: COLORS.electricSprout,
  },
  pointsNoteText: {
    ...TYPE.body,
    color: COLORS.paleFern,
  },
  heroActions: {
    flexDirection: 'row',
    gap: SPACING.s16,
  },
  heroBtn: {
    flex: 1,
  },
  lightBand: {
    backgroundColor: COLORS.pureWhite,
    paddingHorizontal: SPACING.s24,
    paddingTop: SPACING.s32,
  },
  sectionHeading: {
    ...TYPE.heading,
    color: COLORS.onyxOlive,
    marginBottom: SPACING.s16,
  },
  accent: { color: COLORS.deepVerdant },
  reviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s8,
  },
  serifIndex: {
    fontFamily: FONTS.serif,
    fontSize: 14,
    fontStyle: 'italic',
    color: COLORS.lichenSage,
  },
  itemBadge: {
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  itemBadgeCorrect: {
    backgroundColor: COLORS.sproutWash,
    borderColor: COLORS.mistGreen,
  },
  itemBadgeWrong: {
    backgroundColor: COLORS.forestDepths,
    borderColor: COLORS.onyxOlive,
  },
  itemBadgeText: { fontSize: 11, fontWeight: '600' },
  itemBadgeTextCorrect: { color: COLORS.mossShadow },
  itemBadgeTextWrong: { color: COLORS.pureWhite },
  questionText: {
    ...TYPE.headingSm,
    color: COLORS.onyxOlive,
    marginBottom: SPACING.s16,
  },
  answerRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.mistGreen,
    paddingTop: SPACING.s8,
  },
  answerLabel: { ...TYPE.caption, color: COLORS.lichenSage, marginBottom: 4 },
  answerValue: { ...TYPE.body, color: COLORS.onyxOlive },
  correctBox: {
    backgroundColor: COLORS.sproutWash,
    borderWidth: 1,
    borderColor: COLORS.mistGreen,
    borderRadius: RADIUS.buttonCompact,
    padding: SPACING.s16,
    marginTop: SPACING.s16,
  },
  correctLabel: { ...TYPE.caption, fontWeight: '600', color: COLORS.mossShadow, marginBottom: 4 },
  correctValue: { ...TYPE.body, fontWeight: '500', color: COLORS.mossShadow },
});
