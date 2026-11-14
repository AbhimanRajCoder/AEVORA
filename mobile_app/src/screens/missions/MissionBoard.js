import React, { useCallback, useState } from 'react';
import { ScrollView, Text, View, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { apiRequest } from '../../services/apiClient';
import { PrimaryButton } from '../../components/PrimaryButton';
import { s } from './missionStyles';

export function MissionBoard({navigation}) {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [revision, reload] = useState(0);
  useFocusEffect(useCallback(() => {
    let current = true;
    setBusy(true);
    setError('');
    apiRequest('/missions').then(data => { if (current) setRows(data); })
      .catch(e => { if (current) setError(e.message); })
      .finally(() => { if (current) setBusy(false); });
    return () => { current = false; };
  }, [revision]));
  return <ScrollView style={s.page} contentContainerStyle={s.content}
    refreshControl={<RefreshControl refreshing={busy} onRefresh={() => reload(n => n + 1)} />}>
    <View style={s.hero}><Text style={s.heroTitle}>Campus missions</Text>
      <Text style={s.heroNote}>Your campus preparedness assignments, ordered by deadline.</Text></View>
    {!!error && <View style={s.card}><Text style={s.error}>{error}</Text>
      <PrimaryButton label="Retry" onPress={() => reload(n => n + 1)} /></View>}
    {!busy && !error && !rows.length && <Text style={s.body}>Your campus has no assignments yet.</Text>}
    {rows.map(row => <View key={row.id} style={s.card}>
      <Text style={s.meta}>Due {row.due_on}</Text><Text style={s.title}>{row.title}</Text>
      <Text style={s.body}>{row.brief}</Text>
      <PrimaryButton label="Open checklist" onPress={() => navigation.navigate('MissionDetail', {mission:row})} />
    </View>)}
  </ScrollView>;
}
