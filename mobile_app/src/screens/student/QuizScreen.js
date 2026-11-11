// Quiz screen fetching questions from backend, stepping through radio options, and grading server-side.

import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { getQuiz, submitQuiz } from '../../services/quizService';
import { AtmosphericOrb } from '../../components/AtmosphericOrb';
import { ProgressBar } from '../../components/ProgressBar';
import { PrimaryButton } from '../../components/PrimaryButton';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { COLORS, FONTS, RADIUS, SPACING, TYPE } from '../../constants/theme';

export const QuizScreen = ({ route, navigation }) => {
  const { moduleId, moduleTitle } = route.params || {};
  const { refreshUser } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const loadQuiz = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setSubmitError('');
    setCurrentIndex(0);
    setSelectedAnswers({});
    try {
      const data = await getQuiz(moduleId);
      setQuiz(data);
    } catch (err) {
      setError(err.message || 'Unable to load quiz questions.');
    } finally {
      setIsLoading(false);
    }
  }, [moduleId]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  if (isLoading) return <LoadingState dark message="Loading module quiz..." />;
  if (error) return <ErrorState message={error} onRetry={loadQuiz} />;

  const questions = quiz?.questions || [];
  if (questions.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <EmptyState
          title="No quiz questions yet"
          subtitle="This module does not have quiz questions configured."
        />
        <PrimaryButton
          label="Back to Module"
          variant="outlineLight"
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = questions.filter((q) => Boolean(selectedAnswers[q.id])).length;
  const allAnswered = answeredCount === questions.length;
  const isLastQuestion = currentIndex === questions.length - 1;
  const currentChoice = selectedAnswers[currentQuestion.id];

  const handleSelectOption = (optionText) => {
    setSubmitError('');
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionText,
    }));
  };

  const handleSubmit = async () => {
    if (!allAnswered || isSubmitting) return;
    setSubmitError('');
    setIsSubmitting(true);
    try {
      const answersPayload = questions.map((q) => ({
        question_id: q.id,
        answer: selectedAnswers[q.id],
      }));
      const result = await submitQuiz(moduleId, answersPayload);
      if (result?.points_awarded > 0) {
        await refreshUser().catch(() => null);
      }
      navigation.replace('QuizResult', {
        result,
        moduleId,
        moduleTitle: quiz?.module_title || moduleTitle,
      });
    } catch (err) {
      setSubmitError(err.message || 'Could not submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Band 1: Forest Depths Question Stage */}
      <View style={styles.darkStage}>
        <AtmosphericOrb style={styles.orb} />

        <View style={styles.topRow}>
          <Text style={styles.serifCounter}>
            Question {currentIndex + 1} of {questions.length}
          </Text>
          <View style={styles.answeredPill}>
            <Text style={styles.answeredText}>
              {answeredCount}/{questions.length} answered
            </Text>
          </View>
        </View>

        <Text style={styles.moduleName}>{quiz?.module_title || moduleTitle || 'Quiz'}</Text>

        <View style={styles.progressWrap}>
          <ProgressBar
            dark
            percentage={Math.round(((currentIndex + 1) / questions.length) * 100)}
          />
        </View>

        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      {/* Band 2: Pure White Options & Navigation */}
      <View style={styles.lightBand}>
        {(currentQuestion.options || []).map((option, idx) => {
          const isSelected = currentChoice === option;
          return (
            <Pressable
              key={`${currentQuestion.id}-${idx}`}
              onPress={() => handleSelectOption(option)}
              style={[styles.optionCard, isSelected && styles.optionCardSelected]}
            >
              <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                {isSelected ? <View style={styles.radioInner} /> : null}
              </View>
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option}
              </Text>
            </Pressable>
          );
        })}

        {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

        <View style={styles.navRow}>
          <PrimaryButton
            label="Previous"
            variant="outlineLight"
            disabled={currentIndex === 0}
            onPress={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            style={styles.halfBtn}
          />
          {!isLastQuestion ? (
            <PrimaryButton
              label="Next Question"
              variant={currentChoice ? 'sprout' : 'outlineLight'}
              onPress={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              style={styles.halfBtn}
            />
          ) : (
            <PrimaryButton
              label="Submit Quiz"
              variant="sprout"
              disabled={!allAnswered}
              isLoading={isSubmitting}
              onPress={handleSubmit}
              style={styles.halfBtn}
            />
          )}
        </View>

        {!isLastQuestion && allAnswered ? (
          <PrimaryButton
            label="Submit Quiz"
            variant="sprout"
            isLoading={isSubmitting}
            onPress={handleSubmit}
            style={styles.submitAllBtn}
          />
        ) : null}

        {!allAnswered ? (
          <Text style={styles.helperText}>
            Select an answer for all {questions.length} questions to enable Submit Quiz.
          </Text>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.pureWhite },
  container: { paddingBottom: SPACING.s48 },
  emptyWrap: {
    flex: 1,
    backgroundColor: COLORS.pureWhite,
    padding: SPACING.s24,
    justifyContent: 'center',
  },
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
  serifCounter: {
    fontFamily: FONTS.serif,
    fontSize: 15,
    fontStyle: 'italic',
    color: COLORS.paleFern,
  },
  answeredPill: {
    borderWidth: 1,
    borderColor: COLORS.lichenSage,
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
  },
  answeredText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.pureWhite,
  },
  moduleName: {
    ...TYPE.caption,
    color: COLORS.electricSprout,
    marginBottom: SPACING.s8,
  },
  progressWrap: {
    marginBottom: SPACING.s24,
  },
  questionText: {
    ...TYPE.heading,
    color: COLORS.pureWhite,
  },
  lightBand: {
    backgroundColor: COLORS.pureWhite,
    paddingHorizontal: SPACING.s24,
    paddingTop: SPACING.s24,
  },
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
  optionCardSelected: {
    backgroundColor: COLORS.sproutWash,
    borderColor: COLORS.deepVerdant,
  },
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
  radioOuterSelected: {
    borderColor: COLORS.deepVerdant,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.orb,
    backgroundColor: COLORS.deepVerdant,
  },
  optionText: {
    ...TYPE.bodyMd,
    color: COLORS.onyxOlive,
    flex: 1,
  },
  optionTextSelected: {
    color: COLORS.mossShadow,
    fontWeight: '500',
  },
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
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.s16,
    marginTop: SPACING.s8,
  },
  halfBtn: {
    flex: 1,
  },
  submitAllBtn: {
    marginTop: SPACING.s16,
  },
  helperText: {
    ...TYPE.caption,
    color: COLORS.lichenSage,
    textAlign: 'center',
    marginTop: SPACING.s16,
  },
});
