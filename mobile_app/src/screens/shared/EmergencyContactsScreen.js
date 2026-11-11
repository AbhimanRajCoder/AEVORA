// Emergency Contacts screen with Pure White / Bone White cards and Electric Sprout Call CTAs.

import React, { useCallback, useEffect, useState } from 'react';
import { Linking, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getContacts } from '../../services/contactService';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { COLORS, SPACING, TYPE } from '../../constants/theme';

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

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

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
              onPress={() => Linking.openURL(`tel:${contact.phone}`)}
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
      {renderSection('National', 'Helplines', contactsData.national_contacts || [])}
      {renderSection('Campus', 'Contacts', contactsData.local_contacts || [])}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.pureWhite },
  container: { padding: SPACING.s24, paddingBottom: 112 },
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
