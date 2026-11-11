// TODO: Complete Phase 3.5 QuizScreen (GET /api/v1/quizzes/:moduleId and POST /api/v1/quizzes/:moduleId/submit).

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { COLORS, SPACING, TYPE } from '../../constants/theme';

export const QuizScreen = ({ route, navigation }) => {
  const { moduleTitle } = route.params || {};

  return (
    <View style={styles.screen}>
      <Card variant="dark">
        <Text style={styles.title}>{moduleTitle || 'Module'} Quiz</Text>
        <Text style={styles.subtitle}>
          Interactive quiz grading will be implemented in Phase 3.5.
        </Text>
      </Card>
      <PrimaryButton
        label="Back to Module"
        variant="outlineLight"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.pureWhite, padding: SPACING.s24 },
  title: { ...TYPE.heading, color: COLORS.pureWhite, marginBottom: SPACING.s8 },
  subtitle: { ...TYPE.body, color: COLORS.paleFern },
});

