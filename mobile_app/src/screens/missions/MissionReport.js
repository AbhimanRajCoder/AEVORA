import React,{useState,useEffect} from 'react';
import {Text,View} from 'react-native';
import {apiRequest} from '../../services/apiClient';
import {PrimaryButton} from '../../components/PrimaryButton';
import {ProgressBar} from '../../components/ProgressBar';
import {s} from './missionStyles';

export function MissionReport({revision=0}) {
  const [rows,setRows] = useState([]);
  const [busy,setBusy] = useState(true);
  const [error,setError] = useState('');
  const [version,reload] = useState(0);
  useEffect(() => {
    let current = true;
    setBusy(true);
    setError('');
    Promise.all([apiRequest('/missions'),apiRequest('/missions/participation')])
      .then(([missions,counts]) => {
        const byId = new Map(counts.map(row=>[row.mission_id,row]));
        if (current) setRows(missions.filter(row=>byId.has(row.id)).map(row=>({...row,...byId.get(row.id)})));
      }).catch(e=>{if(current) setError(e.message);}).finally(()=>{if(current) setBusy(false);});
    return ()=>{current=false;};
  },[revision,version]);
  return <View style={s.card}><Text style={s.title}>Mission participation</Text>
    {rows.map(row=><View key={row.id} style={s.card}><Text style={s.meta}>Due {row.due_on}</Text>
      <Text style={s.title}>{row.title}</Text><Text style={s.body}>{row.finished} of {row.enrolled} students finished</Text>
      <ProgressBar percentage={row.enrolled ? 100*row.finished/row.enrolled : 0}/>
      <Text style={s.body}>{row.started-row.finished} in progress · {row.enrolled-row.started} yet to start</Text></View>)}
    {!busy && !error && !rows.length && <Text style={s.body}>Publish a mission to track participation.</Text>}
    {!!error && <Text style={s.error}>{error}</Text>}
    <PrimaryButton label="Refresh participation" variant="outlineLight" isLoading={busy} onPress={()=>reload(n=>n+1)}/>
  </View>;
}
