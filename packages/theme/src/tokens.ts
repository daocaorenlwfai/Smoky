import { createTokens } from '@tamagui/core';

// ── Design Tokens ────────────────────────────────────────────
// All visual values in one place. Switch between light/dark via
// the `theme` key in Tamagui config.

export const tokens = createTokens({
  color: {
    // Brand
    primary: '#58A6FF',
    primaryMuted: 'rgba(88, 166, 255, 0.15)',
    // Backgrounds
    bgDark: '#0D1117',
    bgCard: '#161B22',
    bgCardAlt: '#1C2128',
    bgLight: '#FFFFFF',
    bgCardLight: '#F6F8FA',
    // Text
    textDark: '#C9D1D9',
    textDimDark: '#8B949E',
    textLight: '#1F2328',
    textDimLight: '#656D76',
    // Borders
    borderDark: '#30363D',
    borderLight: '#D0D7DE',
    // Semantic
    success: '#3FB950',
    warning: '#D2991D',
    error: '#F85149',
    // Misc
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'rgba(0,0,0,0)',
  },
  size: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 16,
    full: 9999,
  },
  space: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  zIndex: {
    base: 0,
    above: 10,
    modal: 100,
    toast: 200,
  },
});
