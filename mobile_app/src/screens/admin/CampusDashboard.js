import { FilterRow } from '../../components/ListControls';
import React, { useEffect, useState } from 'react';
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
      setBusy(false);
    }
  }

  return (
    <Card>
      <Text style={styles.heading}>{alert ? 'Publish a campus alert' : 'Add an emergency contact'}</Text>
      <Text style={styles.label}>{label}</Text>
      <TextInput accessibilityLabel={label} style={styles.input} value={name} onChangeText={setName} editable={!busy} />
      <Text style={styles.label}>{detailLabel}</Text>
      <TextInput accessibilityLabel={detailLabel} style={styles.input} value={detail} onChangeText={setDetail}
        editable={!busy} multiline={alert} keyboardType={alert ? 'default' : 'phone-pad'} />
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
  const [section, setSection] = useState("Overview");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setError('');
    setStats(null);
    apiRequest('/dashboard').then(data => { if (active) setStats(data); })
      .catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [revision]);
  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.brand}>AEVORA</Text>
          <PrimaryButton compact variant="outlineDark" label="Sign out" onPress={signOut} />
        </View>
        <Text style={styles.title}>Campus readiness</Text>
        <Text style={styles.subtitle}>{stats?.institution_name || 'Administration'}</Text>
        <FilterRow value={section} options={["Overview", "Alerts", "Contacts"]} onChange={setSection} />
        {section === "Overview" && <Card>
          {stats ? <>
            <Text style={styles.heading}>Preparedness score</Text>
            <Text style={styles.score}>{stats.preparedness_score}%</Text>
            <Text>{stats.total_students} enrolled students</Text>
            {stats.metrics && <Text style={styles.label}>{stats.metrics.completed_lessons_count} lessons completed · {stats.metrics.total_quiz_attempts} quiz attempts · {stats.metrics.drill_participants_count} drill participants</Text>}
            {indicators.map(([label, key]) => <View key={key}>
              <Text style={styles.label}>{label} · {stats[key]}%</Text>
              <ProgressBar percentage={stats[key]} />
            </View>)}
          </> : <Text>{error || 'Loading campus metrics…'}</Text>}
          {(stats || error) ? <PrimaryButton style={styles.refresh} variant="outlineLight"
            label="Refresh metrics" onPress={() => setRevision(value => value + 1)} /> : null}
        </Card>}
        <View style={section !== "Alerts" && {display:"none"}}><CampusForm alert /></View>
        <View style={section !== "Contacts" && {display:"none"}}><CampusForm alert={false} /></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.forestDepths },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: COLORS.electricSprout, fontWeight: '700', letterSpacing: 2 },
  title: { ...TYPE.display, color: COLORS.pureWhite, marginTop: 24 },
  subtitle: { ...TYPE.bodyMd, color: COLORS.paleFern, marginVertical: 12 },
  heading: { ...TYPE.headingSm, color: COLORS.forestDepths },
  score: { fontSize: 54, fontWeight: '700', color: COLORS.forestDepths },
  label: { ...TYPE.body, color: COLORS.onyxOlive, marginTop: 14, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: COLORS.lichenSage, borderRadius: 10, padding: 12,
    backgroundColor: COLORS.pureWhite, color: COLORS.carbon, marginBottom: 8 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 12 },
  option: { padding: 12, borderRadius: 10, backgroundColor: COLORS.softMist },
  optionText: { textTransform: 'capitalize', color: COLORS.carbon },
  selected: { backgroundColor: COLORS.electricSprout },
  refresh: { marginTop: 18 },
});
