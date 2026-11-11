// TODO: Complete Phase 4.3 DrillResultScreen with score breakdown, step review, and retry controls.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { COLORS, SPACING, TYPE } from '../../constants/theme';

// Placeholder destination screen so DrillSimulationScreen submission navigates safely.
export const DrillResultScreen = ({ route, navigation }) => {
  const { result, title } = route.params || {};

  return (
    <View style={styles.container}>
      <Card variant="dark">
        <Text style={styles.eyebrow}>DRILL COMPLETE</Text>
        <Text style={styles.title}>{result?.title || title || 'Drill Results'}</Text>
        <Text style={styles.subtitle}>
          Score: {result?.score ?? 0}% ({result?.total_points_earned ?? 0} /{' '}
          {result?.max_possible_points ?? 0} pts). Full review will be built in Phase 4.3.
        </Text>
        <PrimaryButton
          label="All Drills"
          variant="sprout"
          onPress={() => navigation.popToTop()}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pureWhite,
    padding: SPACING.s24,
    justifyContent: 'center',
  },
  eyebrow: {
    ...TYPE.labelCaps,
    color: COLORS.electricSprout,
    marginBottom: SPACING.s8,
  },
  title: {
    ...TYPE.headingLg,
    color: COLORS.pureWhite,
    marginBottom: SPACING.s12,
  },
  subtitle: {
    ...TYPE.body,
    color: COLORS.paleFern,
    marginBottom: SPACING.s24,
  },
});

