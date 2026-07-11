import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PostHogProvider, usePostHog } from '@template/analytics';
import { setPostHogInstance } from '@template/analytics';
import { getSupabase } from '@template/supabase';
import { useAuthStore } from '../stores/auth';
import { requestTrackingPermission } from '../lib/att';
import 'react-native-reanimated';
import 'react-native-gesture-handler';

// ── Inner layout — runs inside PostHogProvider so hooks work ──
function InnerLayout() {
  const posthog = usePostHog();

  useEffect(() => {
    // Wire PostHog singleton for track() calls outside components
    setPostHogInstance(posthog);

    // Sync Supabase auth state → Zustand store
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => {
      useAuthStore.getState().setAuth(
        data.session?.user ?? null,
        data.session ?? null,
      );
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.getState().setAuth(
        session?.user ?? null,
        session ?? null,
      );
    });

    // Request ATT permission (iOS)
    requestTrackingPermission();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="paywall"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack>
    </>
  );
}

// ── Root layout ─────────────────────────────────────────────
export default function RootLayout() {
  return (
    <PostHogProvider>
      <InnerLayout />
    </PostHogProvider>
  );
}
