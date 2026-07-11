// ── Auth (Supabase) ──────────────────────────────────────────
// Email + OAuth (Apple/Google) via Supabase Auth.
// Depends on @template/supabase for the client singleton.

import { useEffect, useState } from 'react';
import { getSupabase } from '@template/supabase';
import { AuthError, Session, User } from '@supabase/supabase-js';

export type AuthProvider = 'apple' | 'google' | 'email';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | null;
}

// ── Hook ────────────────────────────────────────────────────
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    const supabase = getSupabase();

    // Get initial session
    supabase.auth.getSession().then(({ data, error: err }) => {
      if (err) setError(err);
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return { user, session, isLoading, error };
}

// ── Actions ─────────────────────────────────────────────────
export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabase();
  const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
  if (err) throw err;
  return data;
}

export async function signUpWithEmail(email: string, password: string) {
  const supabase = getSupabase();
  const { data, error: err } = await supabase.auth.signUp({ email, password });
  if (err) throw err;
  return data;
}

export async function signInWithOAuth(provider: 'google' | 'apple') {
  const supabase = getSupabase();
  const { data, error: err } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: undefined, // Expo handles deep links natively
    },
  });
  if (err) throw err;
  return data;
}

export async function signOut() {
  const supabase = getSupabase();
  const { error: err } = await supabase.auth.signOut();
  if (err) throw err;
}

export async function resetPassword(email: string) {
  const supabase = getSupabase();
  const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: undefined,
  });
  if (err) throw err;
}
