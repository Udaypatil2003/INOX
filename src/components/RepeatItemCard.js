import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';
import QuantityStepper from './QuantityStepper';

export default function RepeatItemCard({
  item,
  quantity = 0,
  onIncrement,
  onDecrement,
}) {
  if (!item) return null;

  const price = item.effectivePrice || item.itemOfferRate || item.itemRate || 0;

  return (
    <View style={styles.card}>
      {/* Left: Food Image */}
      <View style={styles.imageContainer}>
        {item.itemImageURL ? (
          <Image
            source={{ uri: item.itemImageURL }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>☕</Text>
          </View>
        )}
      </View>

      {/* Right: Details & Action */}
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={2}>
          {item.itemName}
        </Text>
        <Text style={styles.price}>₹{Math.round(price)}</Text>

        <View style={styles.actionContainer}>
          <QuantityStepper
            quantity={quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            size="small"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 250,
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E8E8E2',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: THEME.colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  imageContainer: {
    width: 76,
    height: 76,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F5F5F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECECE8',
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
    fontSize: 26,
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    lineHeight: 18,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: THEME.colors.textPrimary,
    marginBottom: 8,
  },
  actionContainer: {
    alignSelf: 'flex-start',
  },
});
