// Signup screen on Forest Depths canvas with institution picker and Sprout focus states.

import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { getInstitutions } from '../../services/authService';
import { AtmosphericOrb } from '../../components/AtmosphericOrb';
import { PrimaryButton } from '../../components/PrimaryButton';
import { COLORS, FONTS, RADIUS, SPACING, TYPE } from '../../constants/theme';

export const SignupScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getInstitutions()
      .then((list) => {
        setInstitutions(list || []);
        if (list && list.length > 0) {
          setSelectedInstitutionId(list[0].id);
        }
      })
      .catch(() => null);
  }, []);

  const handleSignup = async () => {
    if (!fullName.trim() || !email.trim() || password.length < 6) {
      setError('Enter your full name, valid email, and password (min 6 characters).');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await signUp({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        institution_id: selectedInstitutionId || undefined,
      });
    } catch (err) {
      setError(err.message || 'Unable to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.canvas}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AtmosphericOrb style={styles.orbBottomLeft} />
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + SPACING.s24, paddingBottom: insets.bottom + SPACING.s32 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heroTitle}>
          Join{' '}
          <Text style={styles.sproutText}>now.</Text>
        </Text>
        <Text style={styles.heroSubtitle}>
          Link your profile to your campus preparedness workspace.
        </Text>

        <View style={styles.darkPanel}>
          <Text style={styles.label}>FULL NAME</Text>
          <TextInput
            style={[styles.input, focusedField === 'name' && styles.inputFocused]}
            value={fullName}
            onChangeText={setFullName}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            placeholder="Aarav Sharma"
            placeholderTextColor={COLORS.lichenSage}
          />

          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={[styles.input, focusedField === 'email' && styles.inputFocused]}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            placeholder="aarav@institution.edu"
            placeholderTextColor={COLORS.lichenSage}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>PASSWORD (MIN 6 CHARS)</Text>
          <TextInput
            style={[styles.input, focusedField === 'password' && styles.inputFocused]}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            placeholder="Create password"
            placeholderTextColor={COLORS.lichenSage}
            secureTextEntry
          />

          {institutions.length > 0 ? (
            <View style={styles.instSection}>
              <Text style={styles.label}>INSTITUTION</Text>
              {institutions.map((inst) => {
                const isSelected = inst.id === selectedInstitutionId;
                return (
                  <Pressable
                    key={inst.id}
                    onPress={() => setSelectedInstitutionId(inst.id)}
                    style={[styles.instChip, isSelected && styles.instChipSelected]}
                  >
                    <Text style={[styles.instName, isSelected && styles.instNameSelected]}>
                      {inst.name}
                    </Text>
                    <Text style={styles.instLocation}>
                      {inst.district}, {inst.state}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton label="Create Account" onPress={handleSignup} isLoading={isSubmitting} />

          <Pressable onPress={() => navigation.goBack()} style={styles.linkRow}>
            <Text style={styles.linkText}>
              Already registered? <Text style={styles.linkUnderline}>Sign In</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  canvas: { flex: 1, backgroundColor: COLORS.forestDepths },
  orbBottomLeft: { bottom: -120, left: -100 },
  container: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: SPACING.s24 },
  heroTitle: {
    fontFamily: FONTS.display,
    ...TYPE.display,
    color: COLORS.pureWhite,
    marginBottom: SPACING.s8,
  },
  sproutText: { color: COLORS.electricSprout },
  heroSubtitle: {
    ...TYPE.body,
    color: COLORS.paleFern,
    marginBottom: SPACING.s24,
  },
  darkPanel: {
    backgroundColor: COLORS.forestDepths,
    borderWidth: 1,
    borderColor: COLORS.onyxOlive,
    borderRadius: RADIUS.card,
    padding: SPACING.s24,
  },
  label: {
    ...TYPE.caption,
    color: COLORS.paleFern,
    fontWeight: '500',
    letterSpacing: 0.8,
    marginBottom: SPACING.s8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.mossShadow,
    borderRadius: RADIUS.input,
    paddingHorizontal: SPACING.s16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.pureWhite,
    backgroundColor: COLORS.forestDepths,
    marginBottom: SPACING.s16,
  },
  inputFocused: { borderColor: COLORS.electricSprout },
  instSection: { marginBottom: SPACING.s16 },
  instChip: {
    borderWidth: 1,
    borderColor: COLORS.onyxOlive,
    borderRadius: RADIUS.card,
    padding: SPACING.s16,
    marginBottom: SPACING.s8,
    backgroundColor: COLORS.forestDepths,
  },
  instChipSelected: {
    borderColor: COLORS.electricSprout,
  },
  instName: { fontSize: 14, fontWeight: '600', color: COLORS.pureWhite },
  instNameSelected: { color: COLORS.electricSprout },
  instLocation: { ...TYPE.caption, color: COLORS.lichenSage, marginTop: 2 },
  error: { ...TYPE.body, color: COLORS.electricSprout, marginBottom: SPACING.s16 },
  linkRow: { marginTop: SPACING.s24, alignItems: 'center' },
  linkText: { ...TYPE.body, color: COLORS.paleFern },
  linkUnderline: { color: COLORS.electricSprout, textDecorationLine: 'underline' },
});
