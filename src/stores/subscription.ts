// ── Subscription Store (Zustand) ────────────────────────────
// Tracks subscription status across the app.

import { create } from 'zustand';

interface SubscriptionStore {
  isSubscribed: boolean;
  isLoading: boolean;
  setSubscribed: (value: boolean) => void;
  setLoading: (value: boolean) => void;
}

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  isSubscribed: false,
  isLoading: true,
  setSubscribed: (value) => set({ isSubscribed: value }),
  setLoading: (value) => set({ isLoading: value }),
}));
