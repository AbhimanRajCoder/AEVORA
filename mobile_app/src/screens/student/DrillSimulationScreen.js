// TODO: Complete Phase 4.2 DrillSimulationScreen with interactive step flow and drill submission.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { COLORS, SPACING, TYPE } from '../../constants/theme';

// Placeholder destination screen so DrillsListScreen navigation resolves safely.
export const DrillSimulationScreen = ({ route, navigation }) => {
  const { drillId, title } = route.params || {};

  return (
    <View style={styles.container}>
      <Card variant="dark">
        <Text style={styles.eyebrow}>SIMULATION WORKSPACE</Text>
        <Text style={styles.title}>{title || 'Virtual Drill'}</Text>
        <Text style={styles.subtitle}>
          Interactive simulation steps for drill {drillId || 'selected'} will be built in Phase 4.2.
        </Text>
        <PrimaryButton
          label="Back to Drills"
          variant="sprout"
          onPress={() => navigation.goBack()}
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

