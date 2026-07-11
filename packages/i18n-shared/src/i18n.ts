import i18next from 'i18next';
import { initReactI18next, useTranslation as useI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import en from './locales/en.json';
import zh from './locales/zh.json';
import es from './locales/es.json';
import ja from './locales/ja.json';

const resources = { en: { translation: en }, zh: { translation: zh }, es: { translation: es }, ja: { translation: ja } };

// Detect system language
const systemLanguage = getLocales()[0]?.languageCode ?? 'en';
const supportedLanguages = ['en', 'zh', 'es', 'ja'];
const defaultLang = supportedLanguages.includes(systemLanguage) ? systemLanguage : 'en';

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: defaultLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

// Re-export the hook so consumers don't need to import react-i18next directly
export function useTranslation() {
  return useI18next();
}

export { i18next, supportedLanguages };
