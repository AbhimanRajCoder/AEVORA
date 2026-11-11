// Signup screen on Forest Depths canvas with campus directory loading, password reveal, and focus states.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
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
import { GoogleSignInButton } from '../../components/GoogleSignInButton';
import { COLORS, FONTS, RADIUS, SPACING, TYPE } from '../../constants/theme';

export const SignupScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { signUp } = useAuth();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [isLoadingInstitutions, setIsLoadingInstitutions] = useState(true);
  const [institutionsError, setInstitutionsError] = useState('');
  const [selectedInstitutionId, setSelectedInstitutionId] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadInstitutions = useCallback(async () => {
    setIsLoadingInstitutions(true);
    setInstitutionsError('');
    try {
      const list = await getInstitutions();
      setInstitutions(list || []);
      if (list && list.length > 0) {
        setSelectedInstitutionId((prev) => prev || list[0].id);
      }
    } catch (err) {
      setInstitutionsError(err.message || 'Unable to load institutions.');
    } finally {
      setIsLoadingInstitutions(false);
    }
  }, []);

  useEffect(() => {
    loadInstitutions();
  }, [loadInstitutions]);

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
          Join <Text style={styles.sproutText}>now.</Text>
        </Text>
        <Text style={styles.heroSubtitle}>
          Link your profile to your campus preparedness workspace.
        </Text>

        <View style={styles.darkPanel}>
          <Text style={styles.label}>FULL NAME</Text>
          <TextInput
            style={[styles.input, focusedField === 'name' && styles.inputFocused]}
            value={fullName}
            onChangeText={(val) => {
              setFullName(val);
              if (error) setError('');
            }}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            placeholder="Aarav Sharma"
            placeholderTextColor={COLORS.lichenSage}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            textContentType="name"
          />

          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            ref={emailRef}
            style={[styles.input, focusedField === 'email' && styles.inputFocused]}
            value={email}
            onChangeText={(val) => {
              setEmail(val);
              if (error) setError('');
            }}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            placeholder="aarav@institution.edu"
            placeholderTextColor={COLORS.lichenSage}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            textContentType="emailAddress"
          />

          <Text style={styles.label}>PASSWORD (MIN 6 CHARS)</Text>
          <View style={[styles.passwordRow, focusedField === 'password' && styles.inputFocused]}>
            <TextInput
              ref={passwordRef}
              style={styles.passwordInput}
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                if (error) setError('');
              }}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              placeholder="Create password"
              placeholderTextColor={COLORS.lichenSage}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={handleSignup}
              textContentType="newPassword"
            />
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={8}
              accessibilityRole="button"
            >
              <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </Pressable>
          </View>

          <View style={styles.instSection}>
            <Text style={styles.label}>INSTITUTION</Text>
            {isLoadingInstitutions ? (
              <View style={styles.instStatusRow}>
                <ActivityIndicator size="small" color={COLORS.electricSprout} />
                <Text style={styles.instStatusText}>Loading campus directory...</Text>
              </View>
            ) : institutionsError ? (
              <View style={styles.instStatusRow}>
                <Text style={styles.instStatusText}>Campus directory unavailable.</Text>
                <Pressable onPress={loadInstitutions}>
                  <Text style={styles.retryLink}>Retry</Text>
                </Pressable>
              </View>
            ) : (
              institutions.map((inst) => {
                const isSelected = inst.id === selectedInstitutionId;
                return (
                  <Pressable
                    key={inst.id}
                    onPress={() => setSelectedInstitutionId(inst.id)}
                    style={[styles.instChip, isSelected && styles.instChipSelected]}
                  >
                    <View style={styles.instTextWrap}>
                      <Text style={[styles.instName, isSelected && styles.instNameSelected]}>
                        {inst.name}
                      </Text>
                      <Text style={styles.instLocation}>
                        {inst.district}, {inst.state}
                      </Text>
                    </View>
                    {isSelected ? <Text style={styles.instCheck}>✓</Text> : null}
                  </Pressable>
                );
              })
            )}
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <PrimaryButton label="Create Account" onPress={handleSignup} isLoading={isSubmitting} />

          <GoogleSignInButton
            institutionId={selectedInstitutionId || undefined}
            onError={setError}
            disabled={isSubmitting}
          />

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
  heroTitle: { fontFamily: FONTS.display, ...TYPE.display, color: COLORS.pureWhite, marginBottom: SPACING.s8 },
  sproutText: { color: COLORS.electricSprout },
  heroSubtitle: { ...TYPE.body, color: COLORS.paleFern, marginBottom: SPACING.s24 },
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
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.mossShadow,
    borderRadius: RADIUS.input,
    paddingHorizontal: SPACING.s16,
    backgroundColor: COLORS.forestDepths,
    marginBottom: SPACING.s16,
  },
  passwordInput: { flex: 1, paddingVertical: 14, fontSize: 15, color: COLORS.pureWhite },
  toggleText: { ...TYPE.caption, fontWeight: '600', color: COLORS.electricSprout, marginLeft: SPACING.s8 },
  inputFocused: { borderColor: COLORS.electricSprout },
  instSection: { marginBottom: SPACING.s16 },
  instStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s8,
    paddingVertical: SPACING.s8,
  },
  instStatusText: { ...TYPE.caption, color: COLORS.paleFern },
  retryLink: { ...TYPE.caption, fontWeight: '600', color: COLORS.electricSprout, textDecorationLine: 'underline' },
  instChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.onyxOlive,
    borderRadius: RADIUS.card,
    padding: SPACING.s16,
    marginBottom: SPACING.s8,
    backgroundColor: COLORS.forestDepths,
  },
  instChipSelected: { borderColor: COLORS.electricSprout },
  instTextWrap: { flex: 1, marginRight: SPACING.s8 },
  instName: { fontSize: 14, fontWeight: '600', color: COLORS.pureWhite },
  instNameSelected: { color: COLORS.electricSprout },
  instLocation: { ...TYPE.caption, color: COLORS.lichenSage, marginTop: 2 },
  instCheck: { fontSize: 15, fontWeight: '700', color: COLORS.electricSprout },
  errorBox: {
    borderWidth: 1,
    borderColor: COLORS.electricSprout,
    borderRadius: RADIUS.buttonCompact,
    padding: SPACING.s12,
    marginBottom: SPACING.s16,
    backgroundColor: COLORS.mossShadow,
  },
  errorText: { ...TYPE.body, color: COLORS.electricSprout },
  linkRow: { marginTop: SPACING.s24, alignItems: 'center' },
  linkText: { ...TYPE.body, color: COLORS.paleFern },
  linkUnderline: { color: COLORS.electricSprout, textDecorationLine: 'underline' },
});
