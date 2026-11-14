import React, { useCallback, useState } from 'react';
import { ScrollView, Text, View, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { apiRequest } from '../../services/apiClient';
import { FilterRow } from '../../components/ListControls';
import { PrimaryButton } from '../../components/PrimaryButton';
import { s } from './missionStyles';

export function MissionBoard({navigation}) {
  const [filter,setFilter] = useState("All");
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
  const stateOf = row => row.checked?.length === row.tasks.length ? 'Finished' : row.checked?.length ? 'Started' : 'New';
  const visible = rows.filter(row => filter === 'All' || filter === stateOf(row));
  const next = rows.find(row => stateOf(row) !== 'Finished');
  return <ScrollView style={s.page} contentContainerStyle={s.content}
    refreshControl={<RefreshControl refreshing={busy} onRefresh={() => reload(n => n + 1)} />}>
    <View style={s.hero}><Text style={s.heroTitle}>Campus missions</Text>
      <Text style={s.heroNote}>Your campus preparedness assignments, ordered by deadline.</Text></View>
    {next && <View style={s.card}><Text style={s.meta}>Next assignment</Text>
      <Text style={s.title}>{next.title}</Text><Text style={s.body}>{next.tasks.find((_,i) => !next.checked?.includes(i))}</Text>
      <PrimaryButton label="Continue assignment" onPress={()=>navigation.navigate('MissionDetail',{mission:next})}/></View>}
    {!!error && <View style={s.card}><Text style={s.error}>{error}</Text>
      <PrimaryButton label="Retry" onPress={() => reload(n => n + 1)} /></View>}
    {!busy && !error && !rows.length && <Text style={s.body}>Your campus has no assignments yet.</Text>}
    <FilterRow value={filter} onChange={setFilter} options={["All","New","Started","Finished"]}/>
    {!!rows.length && !visible.length && <Text style={s.body}>No missions in this view.</Text>}
    {visible.map(row => <View key={row.id} style={s.card}>
      <Text style={s.meta}>{stateOf(row)} · Due {row.due_on}</Text><Text style={s.title}>{row.title}</Text>
      <Text style={s.body}>{row.brief}</Text>
      <PrimaryButton label="Open checklist" onPress={() => navigation.navigate('MissionDetail', {mission:row})} />
    </View>)}
  </ScrollView>;
}
