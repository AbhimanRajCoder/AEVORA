import React, {useState} from 'react';
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
  async function publish() {
    setBusy(true);
    setMessage('');
    try {
      const {steps,...body} = draft;
      await apiRequest('/missions',{method:'POST',body:{...body,tasks:steps.split('\n').map(x=>x.trim()).filter(Boolean)}});
      setDraft(blank);
      setMessage('Mission published to your campus.');
      onPublished?.();
    } catch(e) {setMessage(e.message);}
    finally {setBusy(false);}
  }
  function preview() {
    const steps = draft.steps.split('\n').map(x=>x.trim()).filter(Boolean);
    const summary = [draft.brief, 'Due '+draft.due_on, ...steps.map((step,i)=>(i+1)+'. '+step)].join('\n');
    Alert.alert(draft.title, summary, [{text:'Edit',style:'cancel'},{text:'Publish to campus',onPress:publish}]);
  }
  return <View style={s.card}><Text style={s.title}>Assign a campus mission</Text>
    {fields.map(([key,label,maxLength]) => <View key={key}><Text style={s.body}>{label}</Text>
      <TextInput accessibilityLabel={label} style={s.input} value={draft[key]} editable={!busy}
        maxLength={maxLength} multiline={key === 'steps' || key === 'brief'}
        onChangeText={text => setDraft(previous => ({...previous,[key]:text}))} /></View>)}
    <PrimaryButton label="Preview mission" onPress={preview} isLoading={busy} disabled={Object.values(draft).some(x=>!x.trim())}/>
    {!!message && <Text accessibilityLiveRegion="polite" style={s.body}>{message}</Text>}
  </View>;
}
