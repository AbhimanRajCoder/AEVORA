// TODO: Complete Phase 3.4 LessonReaderScreen (image banner, mark complete, next lesson navigation).

import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { COLORS, SPACING, TYPE } from '../../constants/theme';

export const LessonReaderScreen = ({ route, navigation }) => {
  const { lesson } = route.params || {};

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Card variant="light">
        <Text style={styles.title}>{lesson?.title || 'Lesson'}</Text>
        <Text style={styles.body}>{lesson?.content || ''}</Text>
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
  title: { ...TYPE.heading, color: COLORS.onyxOlive, marginBottom: SPACING.s16 },
  body: { ...TYPE.bodyMd, color: COLORS.onyxOlive },
});

