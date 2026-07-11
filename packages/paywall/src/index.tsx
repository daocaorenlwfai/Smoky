// ── Paywall (RevenueCat) ─────────────────────────────────────
// Wraps RevenueCat initialization, paywall UI, and purchase logic.

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Purchases, { PurchasesPackage, CustomerInfo } from 'react-native-purchases';
import { useTheme } from '@template/theme';
import { useTranslation } from '@template/i18n-shared';
import { track, Events } from '@template/analytics';

// ── Init ────────────────────────────────────────────────────
let rcInitialized = false;

export function initPurchases(_apiKey?: string): void {
  if (rcInitialized) return;
  // RevenueCat SDK auto-configures via EXPO_PUBLIC_REVENUECAT_API_KEY
  // in .env + app.config.ts extra.revenueCatApiKey.
  // No manual configure() call needed with RevenueCat SDK v5+.
  rcInitialized = true;
}

// ── Hook ────────────────────────────────────────────────────
export function useSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSubscription();
  }, []);

  async function checkSubscription() {
    try {
      const info = await Purchases.getCustomerInfo();
      setIsSubscribed(info.entitlements.active['pro'] !== undefined);
    } catch (e) {
      console.warn('[Paywall] Failed to check subscription:', e);
    } finally {
      setIsLoading(false);
    }
  }

  return { isSubscribed, isLoading, refresh: checkSubscription };
}

// ── PaywallScreen ───────────────────────────────────────────
export function PaywallScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    track(Events.PAYWALL_SHOWN);
    loadOfferings();
  }, []);

  async function loadOfferings() {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current?.availablePackages) {
        setPackages(offerings.current.availablePackages);
      }
    } catch (e) {
      console.warn('[Paywall] Failed to load offerings:', e);
    } finally {
      setLoading(false);
    }
  }

  const handlePurchase = useCallback(async (pkg: PurchasesPackage) => {
    setPurchasing(true);
    track(Events.SUBSCRIBE_TAPPED);
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      if (customerInfo.entitlements.active['pro']) {
        track(Events.PURCHASE_COMPLETED);
        Alert.alert('Welcome!', 'You now have full access.');
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert('Error', e.message || 'Purchase failed');
      }
    } finally {
      setPurchasing(false);
    }
  }, []);

  const handleRestore = useCallback(async () => {
    setPurchasing(true);
    try {
      const info = await Purchases.restorePurchases();
      if (info.entitlements.active['pro']) {
        track(Events.PURCHASE_RESTORED);
        Alert.alert('Restored', 'Your purchases have been restored.');
      } else {
        Alert.alert('No Purchases', 'No previous purchases found.');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Restore failed');
    } finally {
      setPurchasing(false);
    }
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const price = packages[0]?.product?.priceString ?? '$4.99';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {t('paywall.title')}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textDim }]}>
        {t('paywall.subtitle', { price })}
      </Text>

      <View style={styles.packages}>
        {packages.map((pkg) => (
          <TouchableOpacity
            key={pkg.identifier}
            style={[styles.packageCard, { backgroundColor: colors.backgroundCard, borderColor: colors.border }]}
            onPress={() => handlePurchase(pkg)}
            disabled={purchasing}
          >
            <Text style={[styles.packageName, { color: colors.text }]}>
              {pkg.packageType === 'ANNUAL' ? 'Yearly' : 'Monthly'}
            </Text>
            <Text style={[styles.packagePrice, { color: colors.primary }]}>
              {pkg.product.priceString}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => packages[0] && handlePurchase(packages[0])}
        disabled={purchasing || packages.length === 0}
      >
        {purchasing ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>{t('paywall.subscribe')}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRestore} disabled={purchasing} style={styles.restoreButton}>
        <Text style={[styles.restoreText, { color: colors.textDim }]}>
          {t('paywall.restore')}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.legalText, { color: colors.textDim }]}>
        {t('paywall.noThanks')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, marginBottom: 32, textAlign: 'center', lineHeight: 22 },
  packages: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  packageCard: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
  },
  packageName: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  packagePrice: { fontSize: 20, fontWeight: '700' },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' },
  restoreButton: { padding: 8, marginBottom: 16 },
  restoreText: { fontSize: 14 },
  legalText: { fontSize: 12 },
});
