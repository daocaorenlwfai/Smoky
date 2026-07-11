// ── Analytics (PostHog) ─────────────────────────────────────────
// Singleton PostHog — `track()` is safe to call anywhere (not just inside components).

import { PostHogProvider, usePostHog } from 'posthog-react-native';

let posthogRef: ReturnType<typeof usePostHog> | null = null;

export function setPostHogInstance(ph: ReturnType<typeof usePostHog>): void {
  posthogRef = ph;
}

export function track(event: string, props?: Record<string, any>): void {
  try {
    posthogRef?.capture(event, props);
  } catch {
    // Analytics should never crash the app
  }
}

export function identify(userId: string, traits?: Record<string, any>): void {
  try {
    posthogRef?.identify(userId, traits);
  } catch {
    // noop
  }
}

// Pre-defined event names for consistency
export const Events = {
  APP_OPENED: 'App Opened',
  PAYWALL_SHOWN: 'Paywall Shown',
  SUBSCRIBE_TAPPED: 'Subscribe Tapped',
  PURCHASE_COMPLETED: 'Purchase Completed',
  PURCHASE_RESTORED: 'Purchase Restored',
  ONBOARDING_COMPLETED: 'Onboarding Completed',
  SETTINGS_CHANGED: 'Settings Changed',
  RATING_SHOWN: 'Rating Shown',
  RATING_LATER: 'Rating Later',
  RATING_DISMISSED: 'Rating Dismissed',
  FEEDBACK_SUBMITTED: 'Feedback Submitted',
} as const;

export { PostHogProvider, usePostHog };
