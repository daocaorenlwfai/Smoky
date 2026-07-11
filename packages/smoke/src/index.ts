// ── Smoke Tracker ────────────────────────────────────────────
// Persists daily cigarette count with MMKV.
// Auto-resets at midnight (keyed by date string).

import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'smoke-tracker' });

function todayKey(): string {
  const d = new Date();
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');
}

export function getTodayCount(): number {
  return storage.getNumber(todayKey()) ?? 0;
}

export function addOne(): number {
  const key = todayKey();
  const count = (storage.getNumber(key) ?? 0) + 1;
  storage.set(key, count);
  return count;
}
