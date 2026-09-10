import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';
import QuantityStepper from './QuantityStepper';

// Veg / Non-Veg Indicator (FSSAI standard)
export function DietaryIndicator({ type = 'Veg', size = 14 }) {
  const isVeg = (type || '').trim().toLowerCase() === 'veg';
  const color = isVeg ? THEME.colors.veg : THEME.colors.nonVeg;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
      }}
    >
      {isVeg ? (
        <View
          style={{
            width: size * 0.45,
            height: size * 0.45,
            borderRadius: (size * 0.45) / 2,
            backgroundColor: color,
          }}
        />
      ) : (
        <View
          style={{
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderLeftWidth: size * 0.28,
            borderRightWidth: size * 0.28,
            borderBottomWidth: size * 0.5,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: color,
          }}
        />
      )}
    </View>
  );
}

export default function FoodItemCard({
  item,
  quantity = 0,
  onIncrement,
  onDecrement,
}) {
  if (!item) return null;

  const price = item.effectivePrice || item.itemOfferRate || item.itemRate || 0;

  return (
    <View style={styles.card}>
      {/* 1. Left: Food Image */}
      <View style={styles.imageContainer}>
        {item.itemImageURL ? (
          <Image
            source={{ uri: item.itemImageURL }}
            style={styles.foodImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>🍿</Text>
          </View>
        )}
      </View>

      {/* 2. Middle: Name & Price */}
      <View style={styles.contentMiddle}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.itemName}
        </Text>
        <Text style={styles.price}>₹{Math.round(price)}</Text>
      </View>

      {/* 3. Right: Yellow Stepper / Add */}
      <View style={styles.actionRight}>
        <QuantityStepper
          quantity={quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.divider,
  },
  imageContainer: {
    width: 82,
    height: 82,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECECE8',
    overflow: 'hidden',
    backgroundColor: '#F5F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 28,
  },
  contentMiddle: {
    flex: 1,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    lineHeight: 20,
    marginBottom: 6,
  },
  price: {
    fontSize: 15,
    fontWeight: '500',
    color: THEME.colors.textPrimary,
  },
  actionRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
