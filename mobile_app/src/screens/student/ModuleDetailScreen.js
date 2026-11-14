// Module detail screen showing header, progress, interactive lessons list, and Take Module Quiz CTA.

import { SearchField, FilterRow } from '../../components/ListControls';
import React, { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getModuleById } from '../../services/moduleService';
import { AtmosphericOrb } from '../../components/AtmosphericOrb';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { PrimaryButton } from '../../components/PrimaryButton';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { COLORS, FONTS, RADIUS, SPACING, TYPE } from '../../constants/theme';

export const ModuleDetailScreen = ({ route, navigation }) => {
  const { moduleId } = route.params;
  const [view, setView] = React.useState('All lessons');
  const [moduleData, setModuleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadModule = useCallback(
    async (refresh = false) => {
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError('');
      try {
        const data = await getModuleById(moduleId);
        setModuleData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [moduleId]
  );

  useFocusEffect(
    useCallback(() => {
      loadModule();
    }, [loadModule])
  );

  if (isLoading) return <LoadingState dark message="Loading module details..." />;
  if (error) return <ErrorState message={error} onRetry={() => loadModule()} />;

  const lessons = moduleData?.lessons || [];

  const nextIndex = lessons.findIndex(item => !item.is_completed);
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={() => loadModule(true)} />
      }
    >
      {/* Band 1: Forest Depths Module Overview */}
      <View style={styles.darkStage}>
        <AtmosphericOrb style={styles.orb} />
        <View style={styles.typePill}>
          <Text style={styles.typeText}>{moduleData?.disaster_type?.toUpperCase()}</Text>
        </View>
        <Text style={styles.title}>{moduleData?.title}</Text>
        <Text style={styles.desc}>{moduleData?.description}</Text>

        <View style={styles.progressBlock}>
          <ProgressBar dark percentage={moduleData?.progress_percentage ?? 0} />
          <Text style={styles.progressText}>
            {moduleData?.completed_lessons ?? 0} of {moduleData?.total_lessons ?? 0} lessons completed (
            {moduleData?.progress_percentage ?? 0}%)
          </Text>
        </View>

        {nextIndex >= 0 && <PrimaryButton label="Open next lesson" variant="outlineDark"
          onPress={() => navigation.navigate('LessonReader', { lesson: lessons[nextIndex], lessons,
            lessonIndex: nextIndex, moduleId, moduleTitle: moduleData.title })} />}
        <PrimaryButton
          label="Take Module Quiz"
          onPress={() =>
            navigation.navigate('Quiz', {
              moduleId,
              moduleTitle: moduleData?.title,
            })
          }
        />
      </View>

      {/* Band 2: Pure White Ordered Lessons List */}
      <View style={styles.lightBand}>
        <Text style={styles.sectionHeading}>
          Module <Text style={styles.accent}>Lessons</Text>
        </Text>

        <FilterRow value={view} options={['All lessons', 'To finish']} onChange={setView} />
        {view === "To finish" && nextIndex < 0 && lessons.length > 0 && <Text>All lessons completed.</Text>}
        {lessons.length === 0 ? (
          <EmptyState title="No lessons in this module yet" />
        ) : (
          lessons.map((lesson, index) => (view === "To finish" && lesson.is_completed) ? null : (
            <Pressable
              key={lesson.id}
              onPress={() =>
                navigation.navigate('LessonReader', {
                  lesson,
                  lessons,
                  lessonIndex: index,
                  moduleId,
                  moduleTitle: moduleData?.title,
                })
              }
            >
              <Card variant="light">
                <View style={styles.lessonTop}>
                  <Text style={styles.serifIndex}>Lesson {String(index + 1).padStart(2, '0')}</Text>
                  <View style={[styles.statusChip, lesson.is_completed && styles.statusChipDone]}>
                    <Text style={[styles.statusText, lesson.is_completed && styles.statusTextDone]}>
                      {lesson.is_completed ? '✓ COMPLETED' : 'READ'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonPreview} numberOfLines={2}>
                  {lesson.content}
                </Text>
              </Card>
            </Pressable>
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
    paddingTop: SPACING.s16,
    paddingBottom: SPACING.s32,
    overflow: 'hidden',
  },
  orb: { top: -110, right: -110 },
  typePill: {
    backgroundColor: COLORS.electricSprout,
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: SPACING.s16,
  },
  typeText: { fontSize: 11, fontWeight: '600', color: COLORS.carbon },
  title: { ...TYPE.heading, color: COLORS.pureWhite, marginBottom: SPACING.s8 },
  desc: { ...TYPE.body, color: COLORS.paleFern, marginBottom: SPACING.s24 },
  progressBlock: { marginBottom: SPACING.s24 },
  progressText: { ...TYPE.caption, color: COLORS.paleFern, marginTop: SPACING.s8 },
  lightBand: {
    backgroundColor: COLORS.pureWhite,
    paddingHorizontal: SPACING.s24,
    paddingTop: SPACING.s24,
  },
  sectionHeading: {
    ...TYPE.heading,
    color: COLORS.onyxOlive,
    marginBottom: SPACING.s16,
  },
  accent: { color: COLORS.deepVerdant },
  lessonTop: {
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
  statusChip: {
    backgroundColor: COLORS.pureWhite,
    borderWidth: 1,
    borderColor: COLORS.mistGreen,
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
  },
  statusChipDone: {
    backgroundColor: COLORS.sproutWash,
    borderColor: COLORS.mistGreen,
  },
  statusText: { fontSize: 11, fontWeight: '500', color: COLORS.lichenSage },
  statusTextDone: { color: COLORS.mossShadow, fontWeight: '600' },
  lessonTitle: { ...TYPE.headingSm, color: COLORS.onyxOlive, marginBottom: SPACING.s8 },
  lessonPreview: { ...TYPE.body, color: COLORS.lichenSage },
});
