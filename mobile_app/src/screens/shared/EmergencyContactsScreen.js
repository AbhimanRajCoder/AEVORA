// Emergency Contacts screen with SOS 112 quick-dial banner and one-tap call actions.

import React, { useCallback, useState } from 'react';
import { Alert, Linking, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getContacts } from '../../services/contactService';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { COLORS, FONTS, SPACING, TYPE } from '../../constants/theme';

const dialPhone = (phone, label) => {
  const sanitized = String(phone || '').replace(/[^\d+]/g, '');
  if (!sanitized) return;
  Linking.openURL(`tel:${sanitized}`).catch(() => {
    Alert.alert('Unable to place call', `Please dial ${phone} directly for ${label}.`);
  });
};

export const EmergencyContactsScreen = () => {
  const [contactsData, setContactsData] = useState({ national_contacts: [], local_contacts: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadContacts = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError('');
    try {
      const data = await getContacts();
      setContactsData(data || { national_contacts: [], local_contacts: [] });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [loadContacts])
  );

  if (isLoading) return <LoadingState message="Loading emergency contacts..." />;
  if (error) return <ErrorState message={error} onRetry={() => loadContacts()} />;

  const renderSection = (title, accent, items) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title} <Text style={styles.accent}>{accent}</Text>
      </Text>
      {items.length === 0 ? (
        <EmptyState title="No contacts listed" />
      ) : (
        items.map((contact) => (
          <Card key={contact.id} variant="light" style={styles.contactCard}>
            <View style={styles.info}>
              <Text style={styles.name}>{contact.name}</Text>
              <Text style={styles.phone}>{contact.phone}</Text>
            </View>
            <PrimaryButton
              label="Call"
              compact
              onPress={() => dialPhone(contact.phone, contact.name)}
            />
          </Card>
        ))
      )}
    </View>
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={() => loadContacts(true)} />
      }
    >
      <Card variant="dark" style={styles.sosCard}>
        <Text style={styles.sosEyebrow}>IMMEDIATE ASSISTANCE</Text>
        <Text style={styles.sosTitle}>
          Emergency <Text style={styles.sosSerif}>Dispatch</Text>
        </Text>
        <Text style={styles.sosBody}>
          In urgent campus or medical danger, call the national emergency number immediately.
        </Text>
        <PrimaryButton
          label="Call 112 Now"
          variant="sprout"
          onPress={() => dialPhone('112', 'National Emergency Helpline')}
        />
      </Card>

      {renderSection('National', 'Helplines', contactsData.national_contacts || [])}
      {renderSection('Campus', 'Contacts', contactsData.local_contacts || [])}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.pureWhite },
  container: { padding: SPACING.s24, paddingBottom: 112 },
  sosCard: { marginBottom: SPACING.s24 },
  sosEyebrow: { ...TYPE.labelCaps, color: COLORS.electricSprout, marginBottom: SPACING.s8 },
  sosTitle: { ...TYPE.headingLg, color: COLORS.pureWhite, marginBottom: SPACING.s8 },
  sosSerif: { fontFamily: FONTS.serif, fontStyle: 'italic', fontWeight: '400' },
  sosBody: { ...TYPE.body, color: COLORS.paleFern, marginBottom: SPACING.s24 },
  section: { marginBottom: SPACING.s24 },
  sectionTitle: { ...TYPE.heading, color: COLORS.onyxOlive, marginBottom: SPACING.s16 },
  accent: { color: COLORS.deepVerdant },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.s16,
  },
  info: { flex: 1, marginRight: SPACING.s16 },
  name: { ...TYPE.bodyMd, fontWeight: '600', color: COLORS.onyxOlive },
  phone: { ...TYPE.body, color: COLORS.lichenSage, marginTop: 2 },
});
