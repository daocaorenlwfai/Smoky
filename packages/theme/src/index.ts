import { useColorScheme } from 'react-native';

// ── Lightweight theme hook ────────────────────────────────────
// Uses the same token values as Tamagui but without Tamagui's
// component wrapper. Use this in non-Tamagui components or when
// you just need color values.

interface ThemeColors {
  background: string;
  backgroundCard: string;
  text: string;
  textDim: string;
  border: string;
  primary: string;
  primaryMuted: string;
  success: string;
  warning: string;
  error: string;
}

const darkTheme: ThemeColors = {
  background: '#0D1117',
  backgroundCard: '#161B22',
  text: '#C9D1D9',
  textDim: '#8B949E',
  border: '#30363D',
  primary: '#58A6FF',
  primaryMuted: 'rgba(88, 166, 255, 0.15)',
  success: '#3FB950',
  warning: '#D2991D',
  error: '#F85149',
};

const lightTheme: ThemeColors = {
  background: '#FFFFFF',
  backgroundCard: '#F6F8FA',
  text: '#1F2328',
  textDim: '#656D76',
  border: '#D0D7DE',
  primary: '#0969DA',
  primaryMuted: 'rgba(9, 105, 218, 0.10)',
  success: '#1A7F37',
  warning: '#9A6700',
  error: '#CF222E',
};

export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = isDark ? darkTheme : lightTheme;

  return { colors, isDark };
}

export { darkTheme, lightTheme };
export type { ThemeColors };
