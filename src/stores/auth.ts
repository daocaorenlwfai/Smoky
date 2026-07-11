// ── Auth Store (Zustand) ────────────────────────────────────
// Global auth state. Sync with Supabase session.
// Use this for non-React code (navigation guards, API interceptors, etc.)

import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';

interface AuthStore {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  setAuth: (user: User | null, session: Session | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  setAuth: (user, session) =>
    set({ user, session, isAuthenticated: !!user }),
  clear: () =>
    set({ user: null, session: null, isAuthenticated: false }),
}));
