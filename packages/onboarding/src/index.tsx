// ── Onboarding Flow ──────────────────────────────────────────
// Full-screen swipeable onboarding with skip/dots/progress.

import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  FlatList, Dimensions, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@template/theme';
import { useTranslation } from '@template/i18n-shared';
import { track, Events } from '@template/analytics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Step {
  key: string;
  title: string;
  description: string;
  icon: string;
}

export function OnboardingFlow() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const steps: Step[] = [
    { key: '1', title: t('onboarding.step1_title'), description: t('onboarding.step1_desc'), icon: '🚀' },
    { key: '2', title: t('onboarding.step2_title'), description: t('onboarding.step2_desc'), icon: '📋' },
    { key: '3', title: t('onboarding.step3_title'), description: t('onboarding.step3_desc'), icon: '✨' },
  ];

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentIndex(index);
  }

  function goToNext() {
    if (currentIndex < steps.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      handleFinish();
    }
  }

  function handleFinish() {
    track(Events.ONBOARDING_COMPLETED);
    router.replace('/(tabs)');
  }

  const isLast = currentIndex === steps.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleFinish}>
        <Text style={[styles.skipText, { color: colors.textDim }]}>{t('onboarding.skip')}</Text>
      </TouchableOpacity>

      {/* Pages */}
      <FlatList
        ref={flatListRef}
        data={steps}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <View style={[styles.page, { width: SCREEN_WIDTH }]}>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.desc, { color: colors.textDim }]}>{item.description}</Text>
          </View>
        )}
        keyExtractor={(item) => item.key}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {steps.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === currentIndex ? colors.primary : colors.border },
            ]}
          />
        ))}
      </View>

      {/* Bottom button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={goToNext}
      >
        <Text style={styles.buttonText}>
          {isLast ? t('onboarding.getStarted') : t('onboarding.next')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingBottom: 40 },
  skipButton: { position: 'absolute', top: 60, right: 24, zIndex: 10, padding: 8 },
  skipText: { fontSize: 15 },
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  icon: { fontSize: 64, marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  desc: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  button: {
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' },
});
