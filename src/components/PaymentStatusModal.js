import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { THEME } from '../constants/theme';

export default function PaymentStatusModal({ visible, status = 'success', amount, message, onClose }) {
  const isSuccess = status === 'success';

  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.85);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          damping: 14,
          stiffness: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View
            style={[
              styles.iconRing,
              { backgroundColor: isSuccess ? THEME.colors.vegLight : THEME.colors.nonVegLight },
            ]}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: isSuccess ? THEME.colors.veg : THEME.colors.nonVeg },
              ]}
            >
              <Ionicons name={isSuccess ? 'checkmark' : 'close'} size={38} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.title}>{isSuccess ? 'Payment Successful' : 'Payment Failed'}</Text>

          {isSuccess ? (
            <Text style={styles.message}>₹{Number(amount).toFixed(2)} paid</Text>
          ) : (
            <Text style={styles.message}>{message || 'Your payment could not be completed.'}</Text>
          )}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onClose}
            style={[styles.doneButton, !isSuccess && styles.doneButtonNeutral]}
          >
            <Text style={styles.doneButtonText}>{isSuccess ? 'Done' : 'OK'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    paddingTop: 28,
    paddingBottom: 22,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: THEME.colors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 24,
  },
  iconRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  iconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  message: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  doneButton: {
    width: '100%',
    backgroundColor: THEME.colors.primaryAccent,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  doneButtonNeutral: {
    backgroundColor: THEME.colors.background,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 0.2,
  },
});
