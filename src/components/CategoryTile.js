import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { THEME } from '../constants/theme';

export default function CategoryTile({ category, onPress }) {
  if (!category) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onPress && onPress(category.id)}
      style={styles.tile}
    >
      <View style={styles.iconCircle}>
        <Ionicons
          name={category.icon || 'fast-food-outline'}
          size={24}
          color="#5A4300"
        />
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {category.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 78,
    alignItems: 'center',
    marginRight: THEME.spacing.sm,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: THEME.colors.cartBarBackground,
    borderWidth: 1.5,
    borderColor: THEME.colors.primaryAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: THEME.colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 10.5,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    textAlign: 'center',
    lineHeight: 13,
  },
});
