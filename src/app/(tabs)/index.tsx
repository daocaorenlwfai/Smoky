import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@template/theme';
import { useTranslation } from '@template/i18n-shared';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {t('home.welcome')}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textDim }]}>
        {t('home.tagline')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
});
