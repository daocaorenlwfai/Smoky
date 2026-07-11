import { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@template/theme';
import { useTranslation } from '@template/i18n-shared';
import { useAuth } from '@template/auth';
import {
  addOne,
  getLocalCount,
  syncFromServer,
} from '@template/smoke';

export default function SmokeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAuth();

  const [count, setCount] = useState(() => getLocalCount());
  const [syncing, setSyncing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scale = useSharedValue(1);

  // Sync from server on mount
  useEffect(() => {
    if (user) {
      syncFromServer()
        .then(setCount)
        .catch((e) => setError(e.message))
        .finally(() => setSyncing(false));
    } else if (!authLoading) {
      setSyncing(false);
    }
  }, [user, authLoading]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(async () => {
    if (!user) return;
    try {
      const newCount = await addOne();
      setCount(newCount);
      setError(null);

      // Burst animation
      scale.value = withSequence(
        withSpring(0.88, { stiffness: 300 }),
        withSpring(1.05, { stiffness: 200 }),
        withSpring(1, { stiffness: 200 }),
      );
    } catch (e: any) {
      setError(e.message);
    }
  }, [user, scale]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.label, { color: colors.textDim }]}>
        {t('smoke.today')}
      </Text>

      {syncing ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <Text style={[styles.count, { color: colors.text }]}>
          {count}
        </Text>
      )}

      <Pressable
        onPress={handlePress}
        disabled={!user || syncing}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <Animated.View
          style={[
            styles.circle,
            animatedStyle,
            {
              backgroundColor: user ? colors.primaryMuted : colors.border,
              borderColor: user ? colors.primary : colors.textDim,
            },
          ]}
        >
          <Text style={styles.emoji}>🚬</Text>
        </Animated.View>
      </Pressable>

      {error ? (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      ) : (
        <Text style={[styles.hint, { color: colors.textDim }]}>
          {user ? t('smoke.hint') : t('smoke.loginRequired')}
        </Text>
      )}
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
  error: {
    fontSize: 13,
    marginTop: 8,
  },
});
