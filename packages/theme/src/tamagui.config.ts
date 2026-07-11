import { createTamagui } from '@tamagui/core';
import { tokens } from './tokens';

const config = createTamagui({
  tokens,
  themes: {
    light: {
      background: tokens.color.bgLight,
      backgroundCard: tokens.color.bgCardLight,
      text: tokens.color.textLight,
      textDim: tokens.color.textDimLight,
      border: tokens.color.borderLight,
      primary: tokens.color.primary,
      primaryMuted: tokens.color.primaryMuted,
      success: tokens.color.success,
      warning: tokens.color.warning,
      error: tokens.color.error,
    },
    dark: {
      background: tokens.color.bgDark,
      backgroundCard: tokens.color.bgCard,
      text: tokens.color.textDark,
      textDim: tokens.color.textDimDark,
      border: tokens.color.borderDark,
      primary: tokens.color.primary,
      primaryMuted: tokens.color.primaryMuted,
      success: tokens.color.success,
      warning: tokens.color.warning,
      error: tokens.color.error,
    },
  },
  defaultTheme: 'dark',
});

export type AppConfig = typeof config;
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
