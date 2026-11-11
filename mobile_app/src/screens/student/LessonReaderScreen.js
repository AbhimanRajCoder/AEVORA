// Lesson reader screen displaying banner image, lesson content, completion action, and next-lesson navigation.

import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { completeLesson } from '../../services/moduleService';
import { AtmosphericOrb } from '../../components/AtmosphericOrb';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { COLORS, FONTS, RADIUS, SPACING, TYPE } from '../../constants/theme';

export const LessonReaderScreen = ({ route, navigation }) => {
  const {
    lesson,
    lessons = [],
    lessonIndex = 0,
    moduleId,
    moduleTitle,
  } = route.params || {};

  const [isCompleted, setIsCompleted] = useState(Boolean(lesson?.is_completed));
  const [completedAt, setCompletedAt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsCompleted(Boolean(lesson?.is_completed));
    setCompletedAt(null);
    setImageFailed(false);
    setError('');
  }, [lesson?.id, lesson?.is_completed]);

  const hasNextLesson = Array.isArray(lessons) && lessonIndex + 1 < lessons.length;
  const nextLesson = hasNextLesson ? lessons[lessonIndex + 1] : null;
  const totalCount = lessons.length > 0 ? lessons.length : 1;

  const handleMarkComplete = async () => {
    if (!lesson?.id || isSubmitting || isCompleted) return;
    setError('');
    setIsSubmitting(true);
    try {
      const result = await completeLesson(lesson.id);
      setIsCompleted(Boolean(result?.is_completed ?? true));
      setCompletedAt(result?.completed_at || null);
    } catch (err) {
      setError(err.message || 'Could not mark lesson complete. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextLesson = () => {
    if (!nextLesson) return;
    navigation.replace('LessonReader', {
      lesson: nextLesson,
      lessons,
      lessonIndex: lessonIndex + 1,
      moduleId,
      moduleTitle,
    });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Band 1: Forest Depths Header */}
      <View style={styles.darkStage}>
        <AtmosphericOrb style={styles.orb} />
        <View style={styles.metaRow}>
          <Text style={styles.serifCounter}>
            Lesson {String(lessonIndex + 1).padStart(2, '0')} of {String(totalCount).padStart(2, '0')}
          </Text>
          <View style={[styles.badge, isCompleted ? styles.badgeDone : styles.badgePending]}>
            <Text style={[styles.badgeText, isCompleted ? styles.badgeTextDone : styles.badgeTextPending]}>
              {isCompleted ? '✓ COMPLETED' : 'IN PROGRESS'}
            </Text>
          </View>
        </View>

        {moduleTitle ? <Text style={styles.moduleLabel}>{moduleTitle}</Text> : null}
        <Text style={styles.title}>{lesson?.title || 'Lesson'}</Text>
      </View>

      {/* Band 2: Pure White Content Bed */}
      <View style={styles.lightBand}>
        <View style={styles.bannerFrame}>
          {lesson?.image_url && !imageFailed ? (
            <Image
              source={{ uri: lesson.image_url }}
              style={styles.bannerImage}
              resizeMode="cover"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <View style={styles.bannerPlaceholder}>
              <Text style={styles.placeholderTag}>SAFETY BRIEFING</Text>
              <Text style={styles.placeholderTitle}>{lesson?.title || 'Preparedness Guide'}</Text>
            </View>
          )}
        </View>

        <Card variant="light">
          <Text style={styles.contentBody}>{lesson?.content || ''}</Text>
        </Card>

        {isCompleted ? (
          <View style={styles.confirmBanner}>
            <Text style={styles.confirmTitle}>✓ Lesson Completed</Text>
            <Text style={styles.confirmSub}>
              {completedAt
                ? `Saved on ${new Date(completedAt).toLocaleDateString()}`
                : 'Your progress has been recorded for this module.'}
            </Text>
          </View>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.actions}>
          {!isCompleted ? (
            <PrimaryButton
              label="Mark as Complete"
              onPress={handleMarkComplete}
              isLoading={isSubmitting}
              style={styles.actionBtn}
            />
          ) : null}

          {hasNextLesson ? (
            <PrimaryButton
              label={`Next: ${nextLesson.title}`}
              variant={isCompleted ? 'sprout' : 'outlineLight'}
              onPress={handleNextLesson}
              style={styles.actionBtn}
            />
          ) : null}

          <PrimaryButton
            label="Back to Module"
            variant="outlineLight"
            onPress={() => navigation.goBack()}
          />
        </View>
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
    paddingTop: SPACING.s16,
    paddingBottom: SPACING.s32,
    overflow: 'hidden',
  },
  orb: { top: -110, right: -110 },
  metaRow: {
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
  badge: {
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  badgeDone: {
    backgroundColor: COLORS.electricSprout,
    borderColor: COLORS.electricSprout,
  },
  badgePending: {
    backgroundColor: 'transparent',
    borderColor: COLORS.lichenSage,
  },
  badgeText: { fontSize: 11, fontWeight: '600' },
  badgeTextDone: { color: COLORS.carbon },
  badgeTextPending: { color: COLORS.paleFern },
  moduleLabel: {
    ...TYPE.caption,
    color: COLORS.electricSprout,
    marginBottom: SPACING.s8,
  },
  title: {
    ...TYPE.heading,
    color: COLORS.pureWhite,
  },
  lightBand: {
    backgroundColor: COLORS.pureWhite,
    paddingHorizontal: SPACING.s24,
    paddingTop: SPACING.s24,
  },
  bannerFrame: {
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.mistGreen,
    overflow: 'hidden',
    marginBottom: SPACING.s16,
    backgroundColor: COLORS.boneWhite,
  },
  bannerImage: {
    width: '100%',
    height: 192,
  },
  bannerPlaceholder: {
    height: 160,
    backgroundColor: COLORS.forestDepths,
    padding: SPACING.s24,
    justifyContent: 'center',
  },
  placeholderTag: {
    ...TYPE.caption,
    color: COLORS.electricSprout,
    letterSpacing: 1,
    marginBottom: SPACING.s8,
  },
  placeholderTitle: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    fontStyle: 'italic',
    color: COLORS.pureWhite,
  },
  contentBody: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '400',
    color: COLORS.onyxOlive,
  },
  confirmBanner: {
    backgroundColor: COLORS.sproutWash,
    borderWidth: 1,
    borderColor: COLORS.mistGreen,
    borderRadius: RADIUS.card,
    padding: SPACING.s16,
    marginBottom: SPACING.s16,
  },
  confirmTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.mossShadow,
    marginBottom: 4,
  },
  confirmSub: {
    ...TYPE.caption,
    color: COLORS.mossShadow,
  },
  errorText: {
    ...TYPE.body,
    color: COLORS.onyxOlive,
    backgroundColor: COLORS.boneWhite,
    borderWidth: 1,
    borderColor: COLORS.onyxOlive,
    borderRadius: RADIUS.card,
    padding: SPACING.s16,
    marginBottom: SPACING.s16,
  },
  actions: {
    marginTop: SPACING.s8,
  },
  actionBtn: {
    marginBottom: SPACING.s16,
  },
});
