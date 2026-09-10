import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

export default function QuantityStepper({
  quantity = 0,
  onIncrement,
  onDecrement,
  size = 'normal',
  style,
}) {
  const isSmall = size === 'small';

  if (quantity === 0) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onIncrement}
        style={[
          styles.addButton,
          isSmall && styles.addButtonSmall,
          style,
        ]}
      >
        <Text style={[styles.addButtonText, isSmall && styles.addButtonTextSmall]}>
          Add
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        styles.stepperContainer,
        isSmall && styles.stepperContainerSmall,
        style,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onDecrement}
        style={[styles.stepperButton, isSmall && styles.stepperButtonSmall]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={[styles.stepperButtonText, isSmall && styles.stepperButtonTextSmall]}>
          −
        </Text>
      </TouchableOpacity>

      <Text style={[styles.quantityText, isSmall && styles.quantityTextSmall]}>
        {quantity}
      </Text>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onIncrement}
        style={[styles.stepperButton, isSmall && styles.stepperButtonSmall]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={[styles.stepperButtonText, isSmall && styles.stepperButtonTextSmall]}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: THEME.colors.addBtnBg,
    borderColor: THEME.colors.addBtnBorder,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 74,
  },
  addButtonSmall: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 64,
  },
  addButtonText: {
    color: '#111111',
    fontSize: 13,
    fontWeight: '700',
  },
  addButtonTextSmall: {
    fontSize: 12,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.stepperYellow,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 92,
  },
  stepperContainerSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 80,
  },
  stepperButton: {
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonSmall: {
    paddingHorizontal: 2,
  },
  stepperButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
    lineHeight: 20,
  },
  stepperButtonTextSmall: {
    fontSize: 15,
    lineHeight: 18,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
    minWidth: 20,
    textAlign: 'center',
  },
  quantityTextSmall: {
    fontSize: 13,
  },
});
