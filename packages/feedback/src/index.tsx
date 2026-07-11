// ── Feedback Module ──────────────────────────────────────────
// In-app rating prompt + feedback form.
// Uses expo-store-review for native rating dialog,
// and a simple email/API-based feedback form.

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  StyleSheet, Alert, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useTheme } from '@template/theme';
import { useTranslation } from '@template/i18n-shared';
import { track, Events } from '@template/analytics';

// ── Stars Component ─────────────────────────────────────────
interface StarsProps {
  rating: number;
  onRate: (rating: number) => void;
  size?: number;
}

export function Stars({ rating, onRate, size = 32 }: StarsProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onRate(star)}>
          <Text style={[styles.star, { fontSize: size }]}>
            {star <= rating ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Rate App Prompt ─────────────────────────────────────────
interface RatePromptProps {
  onRate: () => void;
  onLater: () => void;
  onNever: () => void;
}

export function RatePrompt({ onRate, onLater, onNever }: RatePromptProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
      <View style={[styles.modalContent, { backgroundColor: colors.backgroundCard }]}>
        <Text style={[styles.modalTitle, { color: colors.text }]}>
          {t('feedback.rateTitle')}
        </Text>
        <Text style={[styles.modalSubtitle, { color: colors.textDim }]}>
          {t('feedback.rateMessage')}
        </Text>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={onRate}
        >
          <Text style={styles.primaryButtonText}>{t('feedback.rateNow')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={onLater}>
          <Text style={[styles.secondaryButtonText, { color: colors.textDim }]}>
            {t('feedback.later')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tertiaryButton} onPress={onNever}>
          <Text style={[styles.tertiaryButtonText, { color: colors.textDim }]}>
            {t('feedback.never')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Feedback Form ───────────────────────────────────────────
interface FeedbackFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string) => void;
}

export function FeedbackForm({ visible, onClose, onSubmit }: FeedbackFormProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  function handleSubmit() {
    if (rating === 0) {
      Alert.alert(t('feedback.errorTitle'), t('feedback.errorNoRating'));
      return;
    }
    track(Events.FEEDBACK_SUBMITTED, { rating });
    onSubmit(rating, feedback);
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.backgroundCard }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {t('feedback.title')}
          </Text>

          <Stars rating={rating} onRate={setRating} />

          <TextInput
            style={[
              styles.textInput,
              {
                color: colors.text,
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            placeholder={t('feedback.placeholder')}
            placeholderTextColor={colors.textDim}
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
          />

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
          >
            <Text style={styles.primaryButtonText}>{t('feedback.submit')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <Text style={[styles.secondaryButtonText, { color: colors.textDim }]}>
              {t('feedback.cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Feedback Hook ───────────────────────────────────────────
export function useFeedbackTrigger() {
  const [showRatePrompt, setShowRatePrompt] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function triggerAfterUses(count: number, threshold = 5) {
    if (count >= threshold) {
      setShowRatePrompt(true);
    }
  }

  function handleRate() {
    setShowRatePrompt(false);
    setShowForm(true);
    track(Events.RATING_SHOWN);
  }

  function handleLater() {
    setShowRatePrompt(false);
    track(Events.RATING_LATER);
  }

  function handleNever() {
    setShowRatePrompt(false);
    track(Events.RATING_DISMISSED);
  }

  async function handleSubmit(rating: number, feedback: string) {
    // TODO: Send to your backend / Supabase
    console.log('[Feedback] Rating:', rating, 'Feedback:', feedback);
    track(Events.FEEDBACK_SUBMITTED, { rating });
  }

  return {
    showRatePrompt,
    showForm,
    setShowForm,
    triggerAfterUses,
    handleRate,
    handleLater,
    handleNever,
    handleSubmit,
  };
}

const styles = StyleSheet.create({
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  star: { color: '#D2991D' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  modalSubtitle: { fontSize: 14, textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  primaryButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  secondaryButton: { padding: 12, width: '100%', alignItems: 'center' },
  secondaryButtonText: { fontSize: 14 },
  tertiaryButton: { padding: 8, width: '100%', alignItems: 'center' },
  tertiaryButtonText: { fontSize: 13 },
  textInput: {
    width: '100%',
    minHeight: 80,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
});
