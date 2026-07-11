// ── ATT (App Tracking Transparency) ─────────────────────────
// iOS 14.5+ requires user consent before tracking.
// Call requestTrackingPermission() early in app startup.

import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { Platform } from 'react-native';

export async function requestTrackingPermission(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    return true; // Not applicable on Android
  }

  try {
    const { status } = await requestTrackingPermissionsAsync();
    return status === 'granted';
  } catch (err) {
    console.warn('[ATT] Permission request failed:', err);
    return false;
  }
}
