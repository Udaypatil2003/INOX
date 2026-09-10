import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';
import QuantityStepper from './QuantityStepper';
import { DietaryIndicator } from './FoodItemCard';

export default function CartLineItem({
  item,
  quantity = 0,
  onIncrement,
  onDecrement,
}) {
  if (!item || quantity <= 0) return null;

  const unitPrice = item.effectivePrice || item.itemOfferRate || item.itemRate || 0;
  const totalPrice = unitPrice * quantity;

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        {item.itemImageURL ? (
          <Image
            source={{ uri: item.itemImageURL }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>🍿</Text>
          </View>
        )}
      </View>

      <View style={styles.infoWrapper}>
        <View style={styles.nameRow}>
          <DietaryIndicator type={item.foodType} size={13} />
          <Text style={styles.name} numberOfLines={2}>
            {item.itemName}
          </Text>
        </View>

        <View style={styles.stepperContainer}>
          <QuantityStepper
            quantity={quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            size="small"
          />
        </View>
      </View>

      <View style={styles.priceWrapper}>
        <Text style={styles.price}>₹{totalPrice.toFixed(2)}</Text>
        {quantity > 1 && (
          <Text style={styles.unitPriceText}>
            ₹{unitPrice.toFixed(0)} each
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.divider,
  },
  imageWrapper: {
    width: 64,
    height: 64,
    borderRadius: THEME.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: '#F0F0EB',
    marginRight: THEME.spacing.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 24,
  },
  infoWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    lineHeight: 18,
    marginLeft: 6,
    flex: 1,
  },
  stepperContainer: {
    alignSelf: 'flex-start',
  },
  priceWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 70,
    marginLeft: THEME.spacing.sm,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  unitPriceText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
});
