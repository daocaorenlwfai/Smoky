// ── Smoke Tracker ────────────────────────────────────────────
// Dual-layer: MMKV for instant reads, Supabase as source of truth.
// Auto-resets count at midnight (keyed by date string).

import { createMMKV } from 'react-native-mmkv';
import { getSupabase } from '@template/supabase';

const storage = createMMKV({ id: 'smoke-tracker' });

function todayKey(): string {
  const d = new Date();
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');
}

function todayStart(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

// ── Local MMKV (instant, no network) ─────────────────────────

export function getLocalCount(): number {
  return storage.getNumber(todayKey()) ?? 0;
}

function setLocalCount(n: number) {
  storage.set(todayKey(), n);
}

// ── Supabase (source of truth) ───────────────────────────────

export async function getTodayCount(): Promise<number> {
  const supabase = getSupabase();
  const { count, error } = await supabase
    .from('smoking_records')
    .select('*', { count: 'exact', head: true })
    .gte('recorded_at', todayStart());

  if (error) throw error;
  return count ?? 0;
}

export async function addOne(): Promise<number> {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('smoking_records').insert({
    user_id: user.id,
    recorded_at: new Date().toISOString(),
  });

  if (error) throw error;

  // Update local cache
  const newCount = getLocalCount() + 1;
  setLocalCount(newCount);
  return newCount;
}

// Sync remote count to local cache
export async function syncFromServer(): Promise<number> {
  const remote = await getTodayCount();
  setLocalCount(remote);
  return remote;
}
