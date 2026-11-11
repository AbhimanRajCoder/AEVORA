// Shared Emergency Contacts screen displaying national and local contacts with tap-to-call.

import React, { useCallback, useEffect, useState } from 'react';
import { Linking, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getContacts } from '../../services/contactService';
import { Card } from '../../components/Card';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

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

  const renderSection = (title, items) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.length === 0 ? (
        <EmptyState title="No contacts listed" />
      ) : (
        items.map((contact) => (
          <Card key={contact.id} style={styles.contactCard}>
            <View style={styles.info}>
              <Text style={styles.name}>{contact.name}</Text>
              <Text style={styles.phone}>{contact.phone}</Text>
            </View>
            <Pressable
              onPress={() => Linking.openURL(`tel:${contact.phone}`)}
              style={styles.callBtn}
            >
              <Text style={styles.callLabel}>Call</Text>
            </Pressable>
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
      {renderSection('National Helplines', contactsData.national_contacts || [])}
      {renderSection('Campus Contacts', contactsData.local_contacts || [])}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.md },
  section: { marginBottom: SPACING.md },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  contactCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  info: { flex: 1, marginRight: SPACING.sm },
  name: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  phone: { fontSize: 14, color: COLORS.textMuted, marginTop: 2 },
  callBtn: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  callLabel: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
});

