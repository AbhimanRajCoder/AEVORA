import React, {useState, useRef} from 'react';
import {ScrollView, View, Text, Pressable} from 'react-native';
import {apiRequest} from '../../services/apiClient';
import {ProgressBar} from '../../components/ProgressBar';
import {s} from './missionStyles';

export function MissionDetail({route}) {
  const mission = route.params.mission;
  const [checked, setChecked] = useState(mission.checked || []);
  const [pending, setPending] = useState(null);
  const lock = useRef(false);
  const [error, setError] = useState('');
  async function toggle(index) {
    if (lock.current) return;
    lock.current = true;
    setPending(index);
    setError('');
    const done = !checked.includes(index);
    try {
      await apiRequest('/missions/' + mission.id + '/tasks/' + index, {method:'PUT', body:{done}});
      setChecked(previous => done ? [...previous,index] : previous.filter(i => i !== index));
    } catch (e) { setError(e.message); }
    finally { lock.current = false; setPending(null); }
  }
  return <ScrollView style={s.page} contentContainerStyle={s.content}>
    <View style={s.hero}><Text style={s.heroNote}>Due {mission.due_on}</Text>
      <Text style={s.heroTitle}>{mission.title}</Text><Text style={s.heroNote}>{mission.brief}</Text></View>
    <View style={s.card}><Text style={s.title}>Field checklist</Text>
      <Text style={s.meta}>{checked.length} of {mission.tasks.length} completed</Text>
      <ProgressBar percentage={100 * checked.length / mission.tasks.length} />
      {mission.tasks.map((task,i) => <Pressable key={i} accessibilityRole="checkbox"
        accessibilityLabel={task} accessibilityState={{checked:checked.includes(i), disabled:pending !== null}}
        disabled={pending !== null} style={s.task} onPress={() => toggle(i)}>
        <Text style={s.circle}>{pending === i ? '…' : checked.includes(i) ? '☑' : '□'}</Text>
        <Text style={[s.body,s.grow]}>{task}</Text></Pressable>)}
      {!!error && <Text accessibilityLiveRegion="polite" style={s.error}>{error}</Text>}
    </View>
  </ScrollView>;
}
