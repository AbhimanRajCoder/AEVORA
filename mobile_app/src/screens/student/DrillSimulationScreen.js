// Interactive virtual drill wizard stepping through emergency scenarios and grading server-side.

import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { getDrillById, submitDrill } from '../../services/drillService';
import { AtmosphericOrb } from '../../components/AtmosphericOrb';
import { ProgressBar } from '../../components/ProgressBar';
import { PrimaryButton } from '../../components/PrimaryButton';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { COLORS, FONTS, RADIUS, SPACING, TYPE } from '../../constants/theme';

// Renders the Forest Depths scenario prompt stage with progress indicator.
const DrillStageHeader = ({ title, currentIndex, totalSteps, answeredCount, scenario }) => (
  <View style={styles.darkStage}>
    <AtmosphericOrb style={styles.orb} />
    <View style={styles.topRow}>
      <Text style={styles.serifCounter}>
        Step {currentIndex + 1} of {totalSteps}
      </Text>
      <View style={styles.answeredPill}>
        <Text style={styles.answeredText}>
          {answeredCount}/{totalSteps} decided
        </Text>
      </View>
    </View>
    <Text style={styles.drillName}>{title}</Text>
    <View style={styles.progressWrap}>
      <ProgressBar dark percentage={Math.round(((currentIndex + 1) / totalSteps) * 100)} />
    </View>
    <Text style={styles.scenarioText}>{scenario}</Text>
  </View>
);

// Renders a selectable action choice card with neo-botanical radio state.
const ActionOptionCard = ({ action, isSelected, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[styles.optionCard, isSelected && styles.optionCardSelected]}
    accessibilityRole="radio"
    accessibilityState={{ selected: isSelected }}
  >
    <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
      {isSelected ? <View style={styles.radioInner} /> : null}
    </View>
    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{action}</Text>
  </Pressable>
);

// Renders Back/Next step navigation and final Submit Drill controls.
const DrillControls = ({
  isFirst,
  isLast,
  hasCurrentChoice,
  allAnswered,
  totalSteps,
  isSubmitting,
  onPrev,
  onNext,
  onSubmit,
}) => (
  <View>
    <View style={styles.navRow}>
      <PrimaryButton
        label="Back"
        variant="outlineLight"
        disabled={isFirst || isSubmitting}
        onPress={onPrev}
        style={styles.halfBtn}
      />
      {!isLast ? (
        <PrimaryButton
          label="Next"
          variant={hasCurrentChoice ? 'sprout' : 'outlineLight'}
          disabled={isSubmitting}
          onPress={onNext}
          style={styles.halfBtn}
        />
      ) : (
        <PrimaryButton
          label="Submit Drill"
          variant="sprout"
          disabled={!allAnswered}
          isLoading={isSubmitting}
          onPress={onSubmit}
          style={styles.halfBtn}
        />
      )}
    </View>
    {!isLast && allAnswered ? (
      <PrimaryButton
        label="Submit Drill"
        variant="sprout"
        isLoading={isSubmitting}
        onPress={onSubmit}
        style={styles.submitAllBtn}
      />
    ) : null}
    {!allAnswered ? (
      <Text style={styles.helperText}>
        Choose an action for all {totalSteps} steps to enable Submit Drill.
      </Text>
    ) : null}
  </View>
);

// Runs the interactive multi-step drill simulation and routes to DrillResultScreen.
export const DrillSimulationScreen = ({ route, navigation }) => {
  const { drillId, title } = route.params || {};
  const { refreshUser } = useAuth();

  const [drill, setDrill] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const loadDrill = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setSubmitError('');
    setCurrentIndex(0);
    setChoices({});
    try {
      const data = await getDrillById(drillId);
      setDrill(data);
    } catch (err) {
      setError(err.message || 'Unable to load virtual drill.');
    } finally {
      setIsLoading(false);
    }
  }, [drillId]);

  useEffect(() => {
    loadDrill();
  }, [loadDrill]);

  if (isLoading) return <LoadingState dark message="Loading drill scenario..." />;
  if (error) return <ErrorState message={error} onRetry={loadDrill} />;

  const steps = drill?.steps || [];
  if (steps.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <EmptyState
          title="No scenario steps yet"
          subtitle="This virtual drill does not have decision steps configured."
        />
        <PrimaryButton label="Back to Drills" variant="outlineLight" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const totalSteps = drill?.total_steps || steps.length;
  const currentStep = steps[currentIndex];
  const currentAction = choices[currentStep.step];
  const answeredCount = steps.filter((s) => Boolean(choices[s.step])).length;
  const allAnswered = answeredCount === steps.length;

  const handleSelectAction = (actionText) => {
    setSubmitError('');
    setChoices((prev) => ({ ...prev, [currentStep.step]: actionText }));
  };

  const handleSubmit = async () => {
    if (!allAnswered || isSubmitting) return;
    setSubmitError('');
    setIsSubmitting(true);
    try {
      const payload = steps.map((s) => ({ step: s.step, action: choices[s.step] }));
      const result = await submitDrill(drillId, payload);
      if (result?.points_awarded > 0) {
        await refreshUser().catch(() => null);
      }
      navigation.replace('DrillResult', {
        result,
        drillId,
        title: drill?.title || title,
      });
    } catch (err) {
      setSubmitError(err.message || 'Could not submit drill choices. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <DrillStageHeader
        title={drill?.title || title || 'Virtual Drill'}
        currentIndex={currentIndex}
        totalSteps={totalSteps}
        answeredCount={answeredCount}
        scenario={currentStep.scenario}
      />
      <View style={styles.lightBand}>
        {(currentStep.options || []).map((opt, idx) => (
          <ActionOptionCard
            key={`${currentStep.step}-${idx}`}
            action={opt.action}
            isSelected={currentAction === opt.action}
            onPress={() => handleSelectAction(opt.action)}
          />
        ))}
        {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}
        <DrillControls
          isFirst={currentIndex === 0}
          isLast={currentIndex === steps.length - 1}
          hasCurrentChoice={Boolean(currentAction)}
          allAnswered={allAnswered}
          totalSteps={steps.length}
          isSubmitting={isSubmitting}
          onPrev={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          onNext={() => setCurrentIndex((prev) => Math.min(steps.length - 1, prev + 1))}
          onSubmit={handleSubmit}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.pureWhite },
  container: { paddingBottom: SPACING.s48 },
  emptyWrap: { flex: 1, backgroundColor: COLORS.pureWhite, padding: SPACING.s24, justifyContent: 'center' },
  darkStage: {
    backgroundColor: COLORS.forestDepths,
    paddingHorizontal: SPACING.s24,
    paddingTop: SPACING.s16,
    paddingBottom: SPACING.s32,
    overflow: 'hidden',
  },
  orb: { top: -110, right: -100 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s16,
  },
  serifCounter: { fontFamily: FONTS.serif, fontSize: 15, fontStyle: 'italic', color: COLORS.paleFern },
  answeredPill: {
    borderWidth: 1,
    borderColor: COLORS.lichenSage,
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
  },
  answeredText: { fontSize: 12, fontWeight: '500', color: COLORS.pureWhite },
  drillName: { ...TYPE.caption, color: COLORS.electricSprout, marginBottom: SPACING.s8 },
  progressWrap: { marginBottom: SPACING.s24 },
  scenarioText: { ...TYPE.heading, color: COLORS.pureWhite },
  lightBand: { backgroundColor: COLORS.pureWhite, paddingHorizontal: SPACING.s24, paddingTop: SPACING.s24 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.boneWhite,
    borderWidth: 1,
    borderColor: COLORS.mistGreen,
    borderRadius: RADIUS.card,
    padding: SPACING.s16,
    marginBottom: SPACING.s16,
  },
  optionCardSelected: { backgroundColor: COLORS.sproutWash, borderColor: COLORS.deepVerdant },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.orb,
    borderWidth: 1.5,
    borderColor: COLORS.lichenSage,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.s16,
    backgroundColor: COLORS.pureWhite,
  },
  radioOuterSelected: { borderColor: COLORS.deepVerdant },
  radioInner: { width: 10, height: 10, borderRadius: RADIUS.orb, backgroundColor: COLORS.deepVerdant },
  optionText: { ...TYPE.bodyMd, color: COLORS.onyxOlive, flex: 1 },
  optionTextSelected: { color: COLORS.mossShadow, fontWeight: '500' },
  submitError: {
    ...TYPE.body,
    color: COLORS.onyxOlive,
    backgroundColor: COLORS.boneWhite,
    borderWidth: 1,
    borderColor: COLORS.onyxOlive,
    borderRadius: RADIUS.card,
    padding: SPACING.s16,
    marginBottom: SPACING.s16,
  },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', gap: SPACING.s16, marginTop: SPACING.s8 },
  halfBtn: { flex: 1 },
  submitAllBtn: { marginTop: SPACING.s16 },
  helperText: { ...TYPE.caption, color: COLORS.lichenSage, textAlign: 'center', marginTop: SPACING.s16 },
});
