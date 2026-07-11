// ── Expo Config ─────────────────────────────────────────────
// app.config.ts — dynamic Expo config with env vars.
// Forked apps override EXPO_PUBLIC_* vars in .env

const IS_DEV = process.env.NODE_ENV !== 'production';

export default {
  expo: {
    name: 'Smoky',
    slug: 'Smoky',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'smoky',
    userInterfaceStyle: 'automatic',
    splash: {
      backgroundColor: '#0D1117',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.smoky.app',
      infoPlist: {
        NSUserTrackingUsageDescription:
          'This identifier will be used to deliver personalized ads and improve your experience.',
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#0D1117',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
      package: 'com.smoky.app',
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-status-bar',
      'expo-localization',
      '@sentry/react-native/expo',
      [
        'expo-tracking-transparency',
        {
          userTrackingPermission:
            'This identifier will be used to deliver personalized ads.',
        },
      ],
    ],
    extra: {
      revenueCatApiKey: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY,
      eas: {
        projectId: '00000000-0000-0000-0000-000000000000',
      },
    },
  },
};
