// ── Settings Screen ─────────────────────────────────────────
// Reusable settings list with Appearance / Language / Legal.

import React from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView, StyleSheet, Linking, Alert } from 'react-native';
import { useTheme } from '@template/theme';
import { useTranslation, i18next, supportedLanguages } from '@template/i18n-shared';

interface SettingRow {
  key: string;
  label: string;
  type: 'toggle' | 'link' | 'info';
  action?: () => void;
  value?: boolean;
  detail?: string;
}

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  zh: '中文',
  es: 'Español',
  ja: '日本語',
};

export function SettingsScreen() {
  const { colors, isDark } = useTheme();
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language || 'en';

  function handleDarkModeToggle() {
    // Theme switching is handled by system appearance via useTheme().
    // For manual override, store preference in MMKV and re-read.
    Alert.alert(t('settings.appearance'), 'Theme follows system appearance by default.');
  }

  function handleLanguageCycle() {
    const idx = supportedLanguages.indexOf(currentLang);
    const nextIdx = (idx + 1) % supportedLanguages.length;
    i18next.changeLanguage(supportedLanguages[nextIdx]);
  }

  function handleOpenLink(url: string) {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open link.');
    });
  }

  function handleRateApp() {
    // Placeholder — integrate expo-store-review
    Alert.alert(t('settings.rate'), 'Thanks for your support!');
  }

  function handleFeedback() {
    Alert.alert(t('settings.feedback'), 'Send feedback to: feedback@example.com');
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>{t('settings.title')}</Text>

      {/* Appearance Section */}
      <Text style={[styles.sectionTitle, { color: colors.textDim }]}>
        {t('settings.appearance')}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.backgroundCard, borderColor: colors.border }]}>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.darkMode')}</Text>
          <Switch
            value={isDark}
            onValueChange={handleDarkModeToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
        <TouchableOpacity style={styles.row} onPress={handleLanguageCycle}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.language')}</Text>
          <Text style={[styles.rowDetail, { color: colors.textDim }]}>
            {LANGUAGE_LABELS[currentLang] || currentLang}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Legal Section */}
      <Text style={[styles.sectionTitle, { color: colors.textDim }]}>Legal</Text>
      <View style={[styles.card, { backgroundColor: colors.backgroundCard, borderColor: colors.border }]}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => handleOpenLink('https://example.com/privacy')}
        >
          <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.privacy')}</Text>
        </TouchableOpacity>
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
        <TouchableOpacity
          style={styles.row}
          onPress={() => handleOpenLink('https://example.com/terms')}
        >
          <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.terms')}</Text>
        </TouchableOpacity>
      </View>

      {/* Feedback Section */}
      <Text style={[styles.sectionTitle, { color: colors.textDim }]}>Support</Text>
      <View style={[styles.card, { backgroundColor: colors.backgroundCard, borderColor: colors.border }]}>
        <TouchableOpacity style={styles.row} onPress={handleFeedback}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.feedback')}</Text>
        </TouchableOpacity>
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
        <TouchableOpacity style={styles.row} onPress={handleRateApp}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.rate')}</Text>
        </TouchableOpacity>
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.version')}</Text>
          <Text style={[styles.rowDetail, { color: colors.textDim }]}>1.0.0</Text>
        </View>
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 32, fontWeight: '700', padding: 24, paddingBottom: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 8 },
  card: { marginHorizontal: 16, borderRadius: 10, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  rowLabel: { fontSize: 16 },
  rowDetail: { fontSize: 14 },
  separator: { height: 1, marginLeft: 56 },
  footer: { height: 48 },
});
