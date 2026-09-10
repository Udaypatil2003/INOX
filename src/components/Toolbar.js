import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { THEME } from '../constants/theme';

export default function Toolbar({
  title = 'Order Snacks',
  subtitle = 'PVR Elan Mercado, Sec 80, Gurugram',
  showBack = false,
  onBack,
  cartCount = 0,
  onCartPress,
}) {
  const insets = useSafeAreaInsets();
  const androidBarHeight = StatusBar.currentHeight || 0;
  // Ensure we have sufficient padding so status bar / notifications never overlap
  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? Math.max(androidBarHeight, 24) : 0
  );

  return (
    <View style={[styles.outerContainer, { paddingTop: topInset }]}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onBack}
              style={styles.backButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="chevron-back" size={26} color="#111111" />
            </TouchableOpacity>
          )}

          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <View style={styles.subtitleRow}>
                <Ionicons name="location-sharp" size={13} color="#111111" style={styles.pinIcon} />
                <Text style={styles.subtitle} numberOfLines={1}>
                  {subtitle}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onCartPress}
          style={styles.cartButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="cart-outline" size={24} color="#111111" />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {cartCount > 99 ? '99+' : cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECE6',
    zIndex: 100,
  },
  container: {
    height: 56,
    backgroundColor: THEME.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 8,
    padding: 2,
    marginLeft: -4,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.2,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  pinIcon: {
    marginRight: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#444444',
    fontWeight: '500',
  },
  cartButton: {
    padding: 6,
    position: 'relative',
    marginLeft: 12,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -2,
    backgroundColor: THEME.colors.primaryAccent,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '800',
  },
});
