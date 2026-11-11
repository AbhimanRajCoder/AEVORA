// Signup screen loading institutions from backend and registering via POST /api/v1/auth/signup.

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
import { useAuth } from '../../context/AuthContext';
import { getInstitutions } from '../../services/authService';
import { PrimaryButton } from '../../components/PrimaryButton';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

export const SignupScreen = ({ navigation }) => {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      .catch(() => {
        // Backend defaults to the primary institution if none is selected
      });
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
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.subtitle}>Join your institution on AEVORA</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Aarav Sharma"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="aarav@institution.edu"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Password (min 6 chars)</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Create password"
            secureTextEntry
          />

          {institutions.length > 0 ? (
            <View style={styles.instSection}>
              <Text style={styles.label}>Institution</Text>
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
              Already registered? <Text style={styles.linkBold}>Sign In</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, justifyContent: 'center', padding: SPACING.lg },
  heading: { fontSize: 26, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  form: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.background,
  },
  instSection: { marginBottom: SPACING.md },
  instChip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.xs,
    backgroundColor: COLORS.background,
  },
  instChipSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  instName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  instNameSelected: { color: COLORS.primary },
  instLocation: { fontSize: 12, color: COLORS.textMuted },
  error: { color: COLORS.danger, fontSize: 13, marginBottom: SPACING.md },
  linkRow: { marginTop: SPACING.md, alignItems: 'center' },
  linkText: { fontSize: 14, color: COLORS.textMuted },
  linkBold: { color: COLORS.primary, fontWeight: '700' },
});

