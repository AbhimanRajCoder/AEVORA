// Login screen in Forest Depths dark canvas with password reveal toggle and keyboard chaining.

import React, { useRef, useState } from 'react';
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
import { AtmosphericOrb } from '../../components/AtmosphericOrb';
import { PrimaryButton } from '../../components/PrimaryButton';
import { GoogleSignInButton } from '../../components/GoogleSignInButton';
import { COLORS, FONTS, RADIUS, SPACING, TYPE } from '../../constants/theme';

export const LoginScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const passwordRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await signIn({ email: email.trim(), password });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.canvas}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AtmosphericOrb style={styles.orbTopRight} />
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + SPACING.s32, paddingBottom: insets.bottom + SPACING.s32 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.announcementPill}>
          <Text style={styles.announcementText}>
            Campus Safety · <Text style={styles.sproutText}>AEVORA</Text> v1.0
          </Text>
        </View>

        <Text style={styles.heroTitle}>
          Be{'\n'}
          ready{'\n'}
          <Text style={styles.sproutText}>now.</Text>
        </Text>
        <Text style={styles.heroSubtitle}>
          Interactive disaster modules, server-graded quizzes, and campus emergency drills.
        </Text>

        <View style={styles.darkPanel}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={[styles.input, focusedField === 'email' && styles.inputFocused]}
            value={email}
            onChangeText={(val) => {
              setEmail(val);
              if (error) setError('');
            }}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            placeholder="student@institution.edu"
            placeholderTextColor={COLORS.lichenSage}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            textContentType="emailAddress"
          />

          <Text style={styles.label}>PASSWORD</Text>
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
              placeholder="Enter your password"
              placeholderTextColor={COLORS.lichenSage}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              textContentType="password"
            />
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            >
              <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </Pressable>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <PrimaryButton label="Sign In" onPress={handleLogin} isLoading={isSubmitting} />

          <GoogleSignInButton onError={setError} disabled={isSubmitting} />

          <Pressable onPress={() => navigation.navigate('Signup')} style={styles.linkRow}>
            <Text style={styles.linkText}>
              New to your campus? <Text style={styles.linkUnderline}>Create an account</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  canvas: { flex: 1, backgroundColor: COLORS.forestDepths },
  orbTopRight: { top: -110, right: -90 },
  container: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: SPACING.s24 },
  announcementPill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.lichenSage,
    borderRadius: RADIUS.orb,
    paddingVertical: SPACING.badgeV,
    paddingHorizontal: SPACING.s16,
    marginBottom: SPACING.s24,
  },
  announcementText: { ...TYPE.body, color: COLORS.pureWhite },
  sproutText: { color: COLORS.electricSprout },
  heroTitle: { fontFamily: FONTS.display, ...TYPE.displayHero, color: COLORS.pureWhite, marginBottom: SPACING.s16 },
  heroSubtitle: { ...TYPE.bodyMd, color: COLORS.paleFern, marginBottom: SPACING.s32 },
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
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.pureWhite,
  },
  toggleText: {
    ...TYPE.caption,
    fontWeight: '600',
    color: COLORS.electricSprout,
    marginLeft: SPACING.s8,
  },
  inputFocused: { borderColor: COLORS.electricSprout },
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
