import { FilterRow } from '../../components/ListControls';
import { MissionComposer } from '../missions/MissionComposer';
import { MissionReport } from '../missions/MissionReport';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ProgressBar } from '../../components/ProgressBar';
import { COLORS, TYPE } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/apiClient';
import { ENDPOINTS } from '../../constants/api';

const indicators = [
  ['Lesson completion', 'lesson_completion_rate'],
  ['Average quiz score', 'average_quiz_score'],
  ['Drill participation', 'drill_participation_rate'],
];

function CampusForm({ alert }) {
  const [name, setName] = useState('');
  const [detail, setDetail] = useState('');
  const [severity, setSeverity] = useState('info');
  const submitting = useRef(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const label = alert ? 'Alert title' : 'Contact name';
  const detailLabel = alert ? 'Message for students' : 'Phone number';

  function reviewAlert() {
    Alert.alert(name.trim(), severity.toUpperCase() + ' · ' + detail.trim(), [
      { text: 'Keep editing', style: 'cancel' }, { text: 'Publish to campus', onPress: submit },
    ]);
  }

  async function submit() {
    if (!alert && !/^[+0-9 ()-]+$/.test(detail.trim())) {
      setMessage('Use digits and an optional country or area code.');
      return;
    }
    if (!alert && !/\d{3}/.test(detail.replace(/\D/g, ''))) {
      setMessage('Enter a phone number with at least three digits.');
      return;
    }
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setMessage('');
    try {
      const body = alert
        ? { title: name.trim(), message: detail.trim(), severity }
        : { name: name.trim(), phone: detail.trim() };
      await apiRequest(alert ? ENDPOINTS.ALERTS : ENDPOINTS.CONTACTS, { method: 'POST', body });
      setMessage(alert ? 'Alert published to your campus.' : 'Contact added to the campus directory.');
      setName('');
      setDetail('');
      setSeverity('info');
    } catch (error) {
      setMessage(error.message);
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return (
    <Card style={styles.panel}>
      <Text style={styles.heading}>{alert ? 'Publish a campus alert' : 'Add an emergency contact'}</Text>
      <Text style={styles.label}>{label}</Text>
      <TextInput accessibilityLabel={label} style={styles.input} value={name} onChangeText={setName} editable={!busy} />
      <Text style={styles.label}>{detailLabel}</Text>
      <TextInput accessibilityLabel={detailLabel} style={[styles.input, alert && styles.multiline]} value={detail} onChangeText={setDetail}
        editable={!busy} multiline={alert} keyboardType={alert ? 'default' : 'phone-pad'} />
      {alert && <Text style={styles.label}>Notice severity</Text>}
      {alert && <View style={styles.options}>{['info', 'warning', 'critical'].map(value => (
        <Pressable key={value} disabled={busy} accessibilityRole="radio" accessibilityState={{ checked: severity === value }}
          onPress={() => setSeverity(value)} style={[styles.option, severity === value && styles.selected]}>
          <Text style={styles.optionText}>{value}</Text>
        </Pressable>
      ))}</View>}
      <PrimaryButton label={alert ? 'Review alert' : 'Save contact'} onPress={alert ? reviewAlert : submit}
        disabled={!name.trim() || !detail.trim()} isLoading={busy} />
      {!!message && <Text accessibilityLiveRegion="polite" style={styles.label}>{message}</Text>}
    </Card>
  );
}

export function CampusDashboard() {
  const { signOut } = useAuth();
  const [missionRevision, refreshMissions] = useState(0);
  const [section, setSection] = useState("Overview");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [refreshing,setRefreshing] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setError('');

    setRefreshing(true);
    apiRequest('/dashboard').then(data => { if (active) setStats(data); })
      .catch(err => { if (active) setError(err.message); })
      .finally(() => { if (active) setRefreshing(false); });
    return () => { active = false; };
  }, [revision]);
  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.banner}>
          <View style={styles.header}>
          <Text style={styles.brand}>AEVORA</Text>
          <PrimaryButton compact variant="outlineDark" label="Sign out" onPress={signOut} />
        </View>
        <Text accessibilityRole="header" style={styles.title}>Campus administration</Text>
        <Text style={styles.subtitle}>{stats?.institution_name || 'Campus safety office'}</Text>
        </View>
        <View style={styles.workspace}>
        <FilterRow value={section} options={["Overview", "Missions", "Notices", "Directory"]} onChange={setSection} />
        {section === "Overview" && <Card style={styles.panel}>
          {stats ? <>
            <Text style={styles.heading}>Campus preparedness</Text>
            <Text style={styles.score}>{stats.preparedness_score}%</Text>
            <Text style={styles.note}>{stats.total_students} enrolled {stats.total_students === 1 ? 'student' : 'students'}</Text>
            {indicators.map(([label, key]) => (
              <View style={styles.indicator} key={key}>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>{label}</Text>
                  <Text style={styles.metricValue}>{stats[key]}%</Text>
                </View>
                <ProgressBar percentage={stats[key]} />
              </View>
            ))}
            {stats.metrics && <View style={styles.activity}>
              <Text style={styles.heading}>Learning activity</Text>
              {[
                ['Lessons completed', stats.metrics.completed_lessons_count],
                ['Quiz attempts', stats.metrics.total_quiz_attempts],
                ['Drill participants', stats.metrics.drill_participants_count],
              ].map(([label, count]) => (
                <View key={label} style={styles.metricRow}>
                  <Text style={styles.metricLabel}>{label}</Text>
                  <Text style={styles.metricValue}>{count}</Text>
                </View>
              ))}
            </View>}
          </> : <Text style={error ? styles.error : styles.note}>{error || 'Loading campus metrics…'}</Text>}
          {stats && !!error && <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text>}
          {(stats || error) ? <PrimaryButton style={styles.refresh} variant="outlineLight"
            isLoading={refreshing} label="Refresh metrics" onPress={() => setRevision(value => value + 1)} /> : null}
        </Card>}
        <View style={[styles.missionSection, section !== 'Missions' && styles.hidden]}>
          <MissionComposer onPublished={() => refreshMissions(n => n + 1)} />
          {section === 'Missions' && <MissionReport revision={missionRevision} />}
        </View>
        <View style={section !== "Notices" && {display:"none"}}><CampusForm alert /></View>
        <View style={section !== "Directory" && {display:"none"}}><CampusForm alert={false} /></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.forestDepths },
  content: { backgroundColor: COLORS.boneWhite, flexGrow: 1, paddingBottom: 40 },
  panel: { backgroundColor: COLORS.pureWhite, marginBottom: 0 },
  banner: { backgroundColor: COLORS.forestDepths, padding: 24 },
  workspace: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 12, gap: 12 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  metricLabel: { ...TYPE.body, color: COLORS.onyxOlive, flex: 1 },
  metricValue: { ...TYPE.bodyMd, color: COLORS.deepVerdant, fontWeight: '700', fontVariant: ['tabular-nums'] },
  note: { ...TYPE.body, color: COLORS.lichenSage },
  indicator: { gap: 6, marginTop: 18 },
  activity: { gap: 12, borderTopWidth: 1, borderColor: COLORS.mistGreen, paddingTop: 18, marginTop: 24 },
  error: { ...TYPE.body, color: COLORS.danger, marginTop: 8 },
  multiline: { minHeight: 84, textAlignVertical: 'top' },
  hidden: { display: 'none' },
  missionSection: { gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: COLORS.electricSprout, fontWeight: '700', letterSpacing: 2 },
  title: { ...TYPE.headingLg, color: COLORS.pureWhite, marginTop: 20 },
  subtitle: { ...TYPE.bodyMd, color: COLORS.paleFern, marginTop: 6 },
  heading: { ...TYPE.headingSm, color: COLORS.forestDepths },
  score: { fontSize: 46, fontWeight: '700', color: COLORS.forestDepths },
  label: { ...TYPE.body, color: COLORS.onyxOlive, marginTop: 14, marginBottom: 6 },
  input: { minHeight: 48, borderWidth: 1, borderColor: COLORS.lichenSage, borderRadius: 10, padding: 12,
    backgroundColor: COLORS.pureWhite, color: COLORS.carbon, marginBottom: 8 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  option: { padding: 12, borderRadius: 10, backgroundColor: COLORS.softMist },
  optionText: { textTransform: 'capitalize', color: COLORS.carbon },
  selected: { backgroundColor: COLORS.electricSprout },
  refresh: { marginTop: 18 },
});
