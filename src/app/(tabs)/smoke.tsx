import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@template/theme';
import { useTranslation } from '@template/i18n-shared';
import { addOne, getTodayCount } from '@template/smoke';

export default function SmokeScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();

  const [count, setCount] = useState(() => getTodayCount());
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    const newCount = addOne();
    setCount(newCount);

    // Burst animation
    scale.value = withSequence(
      withSpring(0.88, { stiffness: 300 }),
      withSpring(1.05, { stiffness: 200 }),
      withSpring(1, { stiffness: 200 }),
    );
  }, [scale]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Today's count */}
      <Text style={[styles.label, { color: colors.textDim }]}>
        {t('smoke.today')}
      </Text>
      <Text style={[styles.count, { color: colors.text }]}>
        {count}
      </Text>

      {/* Circle button */}
      <Pressable onPress={handlePress}>
        <Animated.View
          style={[
            styles.circle,
            animatedStyle,
            {
              backgroundColor: colors.primaryMuted,
              borderColor: colors.primary,
            },
          ]}
        >
          <Text style={styles.emoji}>🚬</Text>
        </Animated.View>
      </Pressable>

      <Text style={[styles.hint, { color: colors.textDim }]}>
        {t('smoke.hint')}
      </Text>
    </View>
  );
}

const CIRCLE_SIZE = 180;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  count: {
    fontSize: 56,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
  },
  hint: {
    fontSize: 14,
    marginTop: 8,
  },
});
