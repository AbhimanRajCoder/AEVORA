// Modules list screen with disaster_type filter chips, progress bars, completion badges, and detail navigation.

import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getModules } from '../../services/moduleService';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { COLORS, FONTS, RADIUS, SPACING, TYPE } from '../../constants/theme';

const DISASTER_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'earthquake', label: 'Earthquake' },
  { key: 'flood', label: 'Flood' },
  { key: 'fire', label: 'Fire' },
  { key: 'cyclone', label: 'Cyclone' },
  { key: 'general', label: 'General' },
];

export const ModulesListScreen = ({ navigation }) => {
  const [modules, setModules] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadModules = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError('');
    try {
      const data = await getModules();
      setModules(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadModules();
    }, [loadModules])
  );

  const filteredModules = useMemo(() => {
    if (selectedType === 'all') return modules;
    return modules.filter(
      (mod) => mod.disaster_type?.toLowerCase() === selectedType
    );
  }, [modules, selectedType]);

  if (isLoading) return <LoadingState message="Loading learning modules..." />;
  if (error) return <ErrorState message={error} onRetry={() => loadModules()} />;

  return (
    <View style={styles.screen}>
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {DISASTER_FILTERS.map((filter) => {
            const isActive = selectedType === filter.key;
            return (
              <Pressable
                key={filter.key}
                onPress={() => setSelectedType(filter.key)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.container}
        data={filteredModules}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => loadModules(true)} />
        }
        ListEmptyComponent={
          <EmptyState
            title={selectedType === 'all' ? 'No modules available' : `No ${selectedType} modules`}
            subtitle="Try selecting another disaster category or pull to refresh."
          />
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate('ModuleDetail', {
                moduleId: item.id,
                title: item.title,
              })
            }
          >
            <Card variant="light">
              <View style={styles.topRow}>
                <View style={styles.badgeGroup}>
                  <View style={styles.sproutChip}>
                    <Text style={styles.chipText}>{item.disaster_type?.toUpperCase()}</Text>
                  </View>
                  {item.is_completed ? (
                    <View style={styles.completedChip}>
                      <Text style={styles.completedChipText}>COMPLETED</Text>
                    </View>
                  ) : null}
                </View>

                <Text style={styles.serifCount}>
                  {item.completed_lessons}/{item.total_lessons} lessons
                </Text>
              </View>

              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.description}</Text>

              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Module progress</Text>
                <Text style={styles.progressPercent}>{item.progress_percentage ?? 0}%</Text>
              </View>
              <ProgressBar percentage={item.progress_percentage} />
            </Card>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.pureWhite },
  filterBar: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.mistGreen,
    backgroundColor: COLORS.pureWhite,
  },
  filterContent: {
    paddingHorizontal: SPACING.s24,
    paddingVertical: SPACING.s16,
    gap: SPACING.s8,
  },
  filterChip: {
    backgroundColor: COLORS.boneWhite,
    borderWidth: 1,
    borderColor: COLORS.mistGreen,
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.s8,
    paddingHorizontal: SPACING.s16,
  },
  filterChipActive: {
    backgroundColor: COLORS.electricSprout,
    borderColor: COLORS.electricSprout,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.onyxOlive,
  },
  filterTextActive: {
    color: COLORS.carbon,
    fontWeight: '600',
  },
  list: { flex: 1, backgroundColor: COLORS.pureWhite },
  container: { padding: SPACING.s24, paddingBottom: 112, flexGrow: 1 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s16,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s8,
    flexShrink: 1,
  },
  sproutChip: {
    backgroundColor: COLORS.sproutWash,
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
  },
  chipText: { fontSize: 12, fontWeight: '500', color: COLORS.mossShadow },
  completedChip: {
    backgroundColor: COLORS.electricSprout,
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
  },
  completedChipText: { fontSize: 11, fontWeight: '600', color: COLORS.carbon },
  serifCount: {
    fontFamily: FONTS.serif,
    fontSize: 15,
    fontStyle: 'italic',
    color: COLORS.lichenSage,
  },
  title: { ...TYPE.headingSm, color: COLORS.onyxOlive, marginBottom: SPACING.s8 },
  desc: { ...TYPE.body, color: COLORS.lichenSage, marginBottom: SPACING.s16 },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s8,
  },
  progressLabel: { ...TYPE.caption, color: COLORS.lichenSage },
  progressPercent: { ...TYPE.caption, fontWeight: '600', color: COLORS.deepVerdant },
});
