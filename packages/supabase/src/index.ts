// ── Supabase Client ─────────────────────────────────────────
// Singleton Supabase client. Reads URL and anon key from env vars.
// Each forked app sets SUPABASE_URL + SUPABASE_ANON_KEY in its .env

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error(
        '[Supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
        'Add them to your .env file.',
      );
    }

    supabaseInstance = createClient(url, key, {
      auth: {
        storage: undefined, // Use MMKV via custom adapter when needed
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  return supabaseInstance;
}

export type { SupabaseClient };
