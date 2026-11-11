// Backend-only Supabase Google Sign-In button with browser launch and session polling.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getGoogleAuthStatus, startGoogleAuth } from '../services/authService';
import { COLORS, RADIUS, SPACING, TYPE } from '../constants/theme';

const POLL_INTERVAL_MS = 1500;
const MAX_WAIT_MS = 180000;

export const GoogleSignInButton = ({ institutionId, onError, disabled = false }) => {
  const { completeGoogleSignIn } = useAuth();
  const [isWaiting, setIsWaiting] = useState(false);

  const pollTimerRef = useRef(null);
  const activeStateRef = useRef(null);
  const startedAtRef = useRef(0);
  const checkingRef = useRef(false);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    activeStateRef.current = null;
    checkingRef.current = false;
    setIsWaiting(false);
  }, []);

  const checkStatusOnce = useCallback(async () => {
    const state = activeStateRef.current;
    if (!state || checkingRef.current) return;

    if (Date.now() - startedAtRef.current > MAX_WAIT_MS) {
      stopPolling();
      if (onError) onError('Google sign-in timed out. Please try again.');
      return;
    }

    checkingRef.current = true;
    try {
      const res = await getGoogleAuthStatus(state);
      if (res?.status === 'completed' && res?.access_token && res?.user) {
        stopPolling();
        await completeGoogleSignIn(res);
      }
    } catch (err) {
      stopPolling();
      if (onError) onError(err.message || 'Google sign-in failed.');
    } finally {
      checkingRef.current = false;
    }
  }, [completeGoogleSignIn, onError, stopPolling]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && activeStateRef.current) {
        checkStatusOnce();
      }
    });
    return () => {
      sub.remove();
      stopPolling();
    };
  }, [checkStatusOnce, stopPolling]);

  const handlePress = async () => {
    if (disabled || isWaiting) return;
    if (onError) onError('');
    setIsWaiting(true);
    try {
      const { auth_url, state } = await startGoogleAuth(institutionId);
      activeStateRef.current = state;
      startedAtRef.current = Date.now();
      pollTimerRef.current = setInterval(checkStatusOnce, POLL_INTERVAL_MS);
      await Linking.openURL(auth_url);
    } catch (err) {
      stopPolling();
      if (onError) onError(err.message || 'Unable to start Google Sign-In.');
    }
  };

  return (
    <View>
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <Pressable
        onPress={handlePress}
        disabled={disabled || isWaiting}
        style={({ pressed }) => [
          styles.button,
          (disabled || isWaiting) && styles.disabled,
          pressed && !isWaiting && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Continue with Google"
      >
        {isWaiting ? (
          <View style={styles.row}>
            <ActivityIndicator size="small" color={COLORS.electricSprout} />
            <Text style={styles.label}>Waiting for Google...</Text>
          </View>
        ) : (
          <View style={styles.row}>
            <View style={styles.gBadge}>
              <Text style={styles.gText}>G</Text>
            </View>
            <Text style={styles.label}>Continue with Google</Text>
          </View>
        )}
      </Pressable>

      {isWaiting ? (
        <Pressable onPress={stopPolling} style={styles.cancelRow}>
          <Text style={styles.cancelText}>Cancel Google Sign-In</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.s16,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.onyxOlive },
  dividerText: { ...TYPE.caption, color: COLORS.lichenSage, marginHorizontal: SPACING.s12 },
  button: {
    borderWidth: 1,
    borderColor: COLORS.paleFern,
    borderRadius: RADIUS.pill,
    paddingVertical: 14,
    paddingHorizontal: SPACING.s24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  disabled: { opacity: 0.65 },
  pressed: { opacity: 0.8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.s12 },
  gBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.electricSprout,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gText: { fontSize: 13, fontWeight: '700', color: COLORS.carbon },
  label: { fontSize: 15, fontWeight: '500', color: COLORS.pureWhite },
  cancelRow: { alignItems: 'center', marginTop: SPACING.s12 },
  cancelText: { ...TYPE.caption, color: COLORS.paleFern, textDecorationLine: 'underline' },
});

