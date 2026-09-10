import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { THEME } from '../constants/theme';

export default function FilterChip({
  label,
  selected = false,
  onPress,
  type = 'category', // 'category' | 'veg' | 'non_veg'
  iconName,
}) {
  const isVeg = type === 'veg';
  const isNonVeg = type === 'non_veg';
  const isDietary = isVeg || isNonVeg;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.chip,
        selected && !isDietary && styles.chipSelectedCategory,
      ]}
    >
      {/* Icon if provided */}
      {iconName && (
        <Ionicons
          name={iconName}
          size={16}
          color="#222222"
          style={styles.leadingIcon}
        />
      )}

      <Text style={styles.label}>{label}</Text>

      {/* Mini Toggle Switch for Veg and Non Veg */}
      {isDietary && (
        <View
          style={[
            styles.toggleTrack,
            selected && (isVeg ? styles.toggleTrackActiveVeg : styles.toggleTrackActiveNonVeg),
          ]}
        >
          <View
            style={[
              styles.toggleThumb,
              selected && styles.toggleThumbActive,
            ]}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E2DC',
    marginRight: 10,
    shadowColor: THEME.colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  chipSelectedCategory: {
    backgroundColor: '#FFF8D9',
    borderColor: '#E0B543',
  },
  leadingIcon: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
  toggleTrack: {
    width: 28,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E0E0DC',
    marginLeft: 8,
    padding: 2,
    justifyContent: 'center',
  },
  toggleTrackActiveVeg: {
    backgroundColor: THEME.colors.veg,
  },
  toggleTrackActiveNonVeg: {
    backgroundColor: THEME.colors.nonVeg,
  },
  toggleThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
});
