// TODO: Complete Phase 3.6 QuizResultScreen (full review breakdown, Retry Quiz, Back to Module).

import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { COLORS, SPACING, TYPE } from '../../constants/theme';

export const QuizResultScreen = ({ route, navigation }) => {
  const { result, moduleTitle } = route.params || {};

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Card variant="dark">
        <Text style={styles.title}>{moduleTitle || 'Quiz'} Result</Text>
        <Text style={styles.score}>{result?.score ?? 0}%</Text>
        <Text style={styles.sub}>
          {result?.correct_count ?? 0} of {result?.total_questions ?? 0} correct ·{' '}
          {result?.is_passed ? 'Passed' : 'Needs Review'}
        </Text>
      </Card>
      <PrimaryButton
        label="Back to Module"
        variant="outlineLight"
        onPress={() => navigation.goBack()}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.pureWhite },
  container: { padding: SPACING.s24 },
  title: { ...TYPE.headingSm, color: COLORS.pureWhite, marginBottom: SPACING.s8 },
  score: { fontSize: 48, fontWeight: '700', color: COLORS.electricSprout, marginBottom: SPACING.s8 },
  sub: { ...TYPE.body, color: COLORS.paleFern },
});

