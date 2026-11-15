import React, {useRef, useState} from 'react';
import {Alert,Text, TextInput, View} from 'react-native';
import {apiRequest} from '../../services/apiClient';
import {PrimaryButton} from '../../components/PrimaryButton';
import {s} from './missionStyles';

const blank = {title:'', brief:'', due_on:'', steps:''};
const fields = [
  ['title','Mission title',100], ['brief','Instructions',700],
  ['due_on','Deadline (YYYY-MM-DD)',10], ['steps','Checklist (one step per line)',2000],
];
export function MissionComposer({onPublished}) {
  const [draft,setDraft] = useState(blank);
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState('');
  const publishing = useRef(false);
  async function publish() {
    if (publishing.current) return;
    publishing.current = true;
    setBusy(true);
    setMessage('');
    try {
      const {steps,...body} = draft;
      await apiRequest('/missions',{method:'POST',body:{...body,tasks:steps.split('\n').map(x=>x.trim()).filter(Boolean)}});
      setDraft(blank);
      setMessage('Mission published to your campus.');
      onPublished?.();
    } catch(e) {setMessage(e.message);}
    finally {publishing.current=false; setBusy(false);}
  }
  function preview() {
    const date = new Date(draft.due_on + 'T00:00:00Z');
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== draft.due_on) {
      setMessage('Enter a valid deadline in YYYY-MM-DD format.');
      return;
    }
    const steps = draft.steps.split('\n').map(x=>x.trim()).filter(Boolean);
    if (steps.length < 1 || steps.length > 12 || steps.some(step => step.length > 160)) {
      setMessage('Enter 1–12 checklist steps, up to 160 characters per step.');
      return;
    }
    setMessage('');
    const summary = [draft.brief, 'Due '+draft.due_on, ...steps.map((step,i)=>(i+1)+'. '+step)].join('\n');
    Alert.alert(draft.title, summary, [{text:'Edit',style:'cancel'},{text:'Publish to campus',onPress:publish}]);
  }
  return <View style={s.card}><Text style={s.title}>Assign a campus mission</Text>
    {fields.map(([key,label,maxLength]) => <View key={key} style={s.field}><Text style={s.fieldLabel}>{label}</Text>
      <TextInput accessibilityLabel={label} style={[s.input, (key === 'steps' || key === 'brief') && s.multiline]} value={draft[key]} editable={!busy}
        maxLength={maxLength} multiline={key === 'steps' || key === 'brief'}
        onChangeText={text => setDraft(previous => ({...previous,[key]:text}))} /></View>)}
    <PrimaryButton label="Preview mission" onPress={preview} isLoading={busy} disabled={Object.values(draft).some(x=>!x.trim())}/>
    {!!message && <Text accessibilityLiveRegion="polite" style={s.body}>{message}</Text>}
  </View>;
}
