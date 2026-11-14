// Virtual drills list screen displaying interactive emergency decision scenarios.

import { SearchField, FilterRow } from '../../components/ListControls';
import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getDrills } from '../../services/drillService';
import { Card } from '../../components/Card';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { COLORS, FONTS, RADIUS, SPACING, TYPE } from '../../constants/theme';

// Renders the dark neo-botanical header summarizing available drill scenarios.
const DrillsHeader = ({ count }) => (
  <Card variant="dark" style={styles.heroCard}>
    <Text style={styles.heroEyebrow}>VIRTUAL DRILLS</Text>
    <Text style={styles.heroTitle}>
      Decision <Text style={styles.heroSerif}>Simulations</Text>
    </Text>
    <Text style={styles.heroSubtitle}>
      Practice step-by-step disaster response choices across {count} campus scenarios.
    </Text>
  </Card>
);

// Renders an individual drill scenario card with step count badge and navigation action.
const DrillCard = ({ item, index, onPress }) => {
  const stepLabel = `${item.total_steps || 0} steps`;
  const scenarioNum = `Scenario ${String(index + 1).padStart(2, '0')}`;
  const preview = item.steps?.[0]?.scenario;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Start ${item.title}`}
    >
      <Card variant="light">
        <View style={styles.topRow}>
          <View style={styles.sproutChip}>
            <Text style={styles.chipText}>{stepLabel}</Text>
          </View>
          <Text style={styles.serifIndex}>{scenarioNum}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        {preview ? (
          <Text style={styles.preview} numberOfLines={2}>
            {preview}
          </Text>
        ) : null}
        <Text style={styles.ctaText}>Start simulation →</Text>
      </Card>
    </Pressable>
  );
};

// Displays all virtual drills fetched from the backend and routes to DrillSimulationScreen.
export const DrillsListScreen = ({ navigation }) => {
  const [query, setQuery] = React.useState('');
  const [order, setOrder] = React.useState('Catalogue');
  const [drills, setDrills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadDrills = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError('');
    try {
      const data = await getDrills();
      setDrills(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDrills();
    }, [loadDrills])
  );

  if (isLoading) return <LoadingState message="Loading virtual drills..." />;
  if (error) return <ErrorState message={error} onRetry={() => loadDrills()} />;

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.container}
      data={drills.filter(item => item.title.toLowerCase().includes(query.trim().toLowerCase())).sort((a,b) => order === 'Shortest first' ? a.total_steps - b.total_steps : 0)}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={() => loadDrills(true)} />
      }
      ListHeaderComponent={<><DrillsHeader count={drills.length} /><SearchField value={query} onChange={setQuery} label="Search scenarios" /><FilterRow value={order} options={['Catalogue', 'Shortest first']} onChange={setOrder} /></>}
      ListEmptyComponent={
        <EmptyState
          title="No virtual drills available"
          subtitle="Check back soon for new preparedness simulations."
        />
      }
      renderItem={({ item, index }) => (
        <DrillCard
          item={item}
          index={index}
          onPress={() =>
            navigation.navigate('DrillSimulation', { drillId: item.id, title: item.title })
          }
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: COLORS.pureWhite },
  container: { padding: SPACING.s24, paddingBottom: 112, flexGrow: 1 },
  heroCard: { marginBottom: SPACING.s24 },
  heroEyebrow: {
    ...TYPE.labelCaps,
    color: COLORS.electricSprout,
    marginBottom: SPACING.s8,
  },
  heroTitle: { ...TYPE.headingLg, color: COLORS.pureWhite, marginBottom: SPACING.s8 },
  heroSerif: { fontFamily: FONTS.serif, fontStyle: 'italic', fontWeight: '400' },
  heroSubtitle: { ...TYPE.body, color: COLORS.paleFern },
  pressed: { opacity: 0.85 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s12,
  },
  sproutChip: {
    backgroundColor: COLORS.sproutWash,
    borderRadius: RADIUS.badge,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: 12,
  },
  chipText: { fontSize: 12, fontWeight: '500', color: COLORS.mossShadow },
  serifIndex: {
    fontFamily: FONTS.serif,
    fontSize: 15,
    fontStyle: 'italic',
    color: COLORS.lichenSage,
  },
  title: { ...TYPE.headingSm, color: COLORS.onyxOlive, marginBottom: SPACING.s8 },
  preview: { ...TYPE.caption, color: COLORS.lichenSage, marginBottom: SPACING.s12 },
  ctaText: { fontSize: 13, fontWeight: '600', color: COLORS.deepVerdant },
});
