// Module detail screen fetching GET /api/v1/modules/:id and displaying ordered lessons.

import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getModuleById } from '../../services/moduleService';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { COLORS, FONTS, RADIUS, SPACING, TYPE } from '../../constants/theme';

export const ModuleDetailScreen = ({ route }) => {
  const { moduleId } = route.params;
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

  useEffect(() => {
    loadModule();
  }, [loadModule]);

  if (isLoading) return <LoadingState message="Loading module details..." />;
  if (error) return <ErrorState message={error} onRetry={() => loadModule()} />;

  const lessons = moduleData?.lessons || [];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={() => loadModule(true)} />
      }
    >
      <Card variant="dark">
        <View style={styles.typePill}>
          <Text style={styles.typeText}>{moduleData?.disaster_type?.toUpperCase()}</Text>
        </View>
        <Text style={styles.title}>{moduleData?.title}</Text>
        <Text style={styles.desc}>{moduleData?.description}</Text>
        <ProgressBar dark percentage={moduleData?.progress_percentage ?? 0} />
        <Text style={styles.progressText}>
          {moduleData?.completed_lessons ?? 0} of {moduleData?.total_lessons ?? 0} lessons completed (
          {moduleData?.progress_percentage ?? 0}%)
        </Text>
      </Card>

      <Text style={styles.sectionHeading}>
        Module <Text style={styles.accent}>Lessons</Text>
      </Text>

      {lessons.length === 0 ? (
        <EmptyState title="No lessons in this module yet" />
      ) : (
        lessons.map((lesson, index) => (
          <Card key={lesson.id} variant="light">
            <View style={styles.lessonTop}>
              <Text style={styles.serifIndex}>Lesson 0{index + 1}</Text>
              <View style={[styles.statusChip, lesson.is_completed && styles.statusChipDone]}>
                <Text style={[styles.statusText, lesson.is_completed && styles.statusTextDone]}>
                  {lesson.is_completed ? 'COMPLETED' : 'PENDING'}
                </Text>
              </View>
            </View>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            <Text style={styles.lessonPreview} numberOfLines={3}>
              {lesson.content}
            </Text>
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.pureWhite },
  container: { padding: SPACING.s24, paddingBottom: SPACING.s48 },
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
  progressText: { ...TYPE.caption, color: COLORS.paleFern, marginTop: SPACING.s8 },
  sectionHeading: {
    ...TYPE.heading,
    color: COLORS.onyxOlive,
    marginTop: SPACING.s8,
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
  statusTextDone: { color: COLORS.mossShadow },
  lessonTitle: { ...TYPE.headingSm, color: COLORS.onyxOlive, marginBottom: SPACING.s8 },
  lessonPreview: { ...TYPE.body, color: COLORS.lichenSage },
});

