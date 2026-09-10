import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { THEME } from '../constants/theme';
import { CATEGORIES, FOOD_TYPES } from '../constants/categories';
import Toolbar from '../components/Toolbar';
import RepeatItemCard from '../components/RepeatItemCard';
import FoodItemCard from '../components/FoodItemCard';
import FilterChip from '../components/FilterChip';
import foodService from '../services/foodService';
import { filterFoodItems } from '../utils/filterUtils';
import { useSelector, useDispatch } from 'react-redux';
import {
  increment as incrementAction,
  decrement as decrementAction,
  openCart as openCartAction,
} from '../features/cart/cartStore';

export default function ListingScreen({ navigation, route }) {
  const initialCategory = route?.params?.initialCategory;

  // Selected Filters State
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory ? [initialCategory] : []
  );
  const [selectedFoodType, setSelectedFoodType] = useState(null); // 'Veg' | 'Non Veg' | null
  const [searchQuery, setSearchQuery] = useState('');

  // Cart Store
  const dispatch = useDispatch();
  const quantities = useSelector((state) => state.cart.quantities);

  // All Items from FoodService
  const allItems = useMemo(() => foodService.getAllItems(), []);
  const repeatItems = useMemo(() => foodService.getRepeatItems(), []);
  const itemsMap = useMemo(() => foodService.getItemsMap(), []);

  // Sync route param change if navigated again
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    } else {
      setSelectedCategories([]);
    }
  }, [initialCategory]);

  // Total cart badge count & total amount
  const totalCartCount = useMemo(() => {
    return Object.values(quantities).reduce((acc, q) => acc + q, 0);
  }, [quantities]);

  const totalAmount = useMemo(() => {
    let sum = 0;
    for (const [itemId, qty] of Object.entries(quantities)) {
      if (qty > 0 && itemsMap.has(itemId)) {
        const item = itemsMap.get(itemId);
        const price = item.effectivePrice || item.itemOfferRate || item.itemRate || 0;
        sum += price * qty;
      }
    }
    return sum;
  }, [quantities, itemsMap]);

  // Filter handlers
  const handleToggleCategory = (catId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(catId)) {
        return prev.filter((id) => id !== catId);
      } else {
        return [...prev, catId];
      }
    });
  };

  const handleToggleFoodType = (type) => {
    setSelectedFoodType((prev) => (prev === type ? null : type));
  };

  // Filtered Main Food List (Pure filter-combination logic + search)
  const filteredFoodItems = useMemo(() => {
    let list = filterFoodItems(allItems, {
      selectedCategories,
      selectedFoodType,
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((item) => item.itemName.toLowerCase().includes(q));
    }

    return list;
  }, [allItems, selectedCategories, selectedFoodType, searchQuery]);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

      {/* 1. Fixed Toolbar at top */}
      <Toolbar
        title="Order Snacks"
        subtitle="PVR Elan Mercado, Sec 80, Gurugram"
        showBack={true}
        onBack={() => navigation.goBack()}
        cartCount={totalCartCount}
        onCartPress={() => dispatch(openCartAction())}
      />

      {/* 2. Vertically scrolling body with sticky filter row at index 1 */}
      <ScrollView
        style={styles.container}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 0: REPEAT AGAIN? Carousel & Bank Offers */}
        <View style={styles.topSection}>
          {/* Header with decorative lines */}
          <View style={styles.repeatHeaderContainer}>
            <View style={styles.headerLine} />
            <Text style={styles.repeatHeaderTitle}>REPEAT AGAIN?</Text>
            <View style={styles.headerLine} />
          </View>

          {/* Repeat Items Carousel */}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={repeatItems}
            keyExtractor={(item) => item.itemId}
            renderItem={({ item }) => (
              <RepeatItemCard
                item={item}
                quantity={quantities[item.itemId] || 0}
                onIncrement={() => dispatch(incrementAction(item.itemId))}
                onDecrement={() => dispatch(decrementAction(item.itemId))}
              />
            )}
            contentContainerStyle={styles.repeatListContent}
          />

          {/* Bank Offers Strip */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offersContent}
            style={styles.offersScrollView}
          >
            <View style={styles.offerCard}>
              <View style={styles.offerIconWrapper}>
                <Ionicons name="pricetag" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.offerText}>
                <Text style={styles.offerBold}>IDBI Bank - 25% Off</Text> on Transactions
              </Text>
            </View>

            <View style={styles.offerCard}>
              <View style={styles.offerIconWrapper}>
                <Ionicons name="pricetag" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.offerText}>
                <Text style={styles.offerBold}>BOBCARD</Text> up to 20% on F&B
              </Text>
            </View>
          </ScrollView>
        </View>

        {/* Section 1: Sticky Filter Row */}
        <View style={styles.stickyFilterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRowContent}
          >
            {/* Veg toggle */}
            <FilterChip
              label="Veg"
              type="veg"
              selected={selectedFoodType === FOOD_TYPES.VEG}
              onPress={() => handleToggleFoodType(FOOD_TYPES.VEG)}
            />

            {/* Non-Veg toggle */}
            <FilterChip
              label="Non Veg"
              type="non_veg"
              selected={selectedFoodType === FOOD_TYPES.NON_VEG}
              onPress={() => handleToggleFoodType(FOOD_TYPES.NON_VEG)}
            />

            {/* Combos Chip with icon */}
            <FilterChip
              label="Combos"
              iconName="restaurant-outline"
              selected={selectedCategories.includes('COMBOS')}
              onPress={() => handleToggleCategory('COMBOS')}
            />

            {/* Remaining Category Chips */}
            {CATEGORIES.filter((c) => c.id !== 'COMBOS').map((cat) => (
              <FilterChip
                key={cat.id}
                label={cat.label}
                selected={selectedCategories.includes(cat.id)}
                onPress={() => handleToggleCategory(cat.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Section 2: Main Food List */}
        <View style={styles.mainListSection}>
          {filteredFoodItems.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search-outline" size={44} color={THEME.colors.textMuted} />
              <Text style={styles.noResultsTitle}>No items found</Text>
              <Text style={styles.noResultsSubtitle}>
                Try adjusting your category or dietary filters.
              </Text>
            </View>
          ) : (
            filteredFoodItems.map((item) => (
              <FoodItemCard
                key={item.itemId}
                item={item}
                quantity={quantities[item.itemId] || 0}
                onIncrement={() => dispatch(incrementAction(item.itemId))}
                onDecrement={() => dispatch(decrementAction(item.itemId))}
              />
            ))
          )}
        </View>

        <View style={{ height: 160 }} />
      </ScrollView>

      {/* 3. Floating Bottom Section (Search Bar + Menu Button + Cart Bar) */}
      <View style={styles.floatingBottomContainer}>
        {/* Search Bar & Menu Button */}
        <View style={styles.searchRow}>
          <View style={styles.searchBarWrapper}>
            <Ionicons name="search-outline" size={20} color="#777777" style={styles.searchIcon} />
            <TextInput
              placeholder='Search "Burger"'
              placeholderTextColor="#888888"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={18} color="#999999" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setSelectedCategories([])}
            style={styles.menuButton}
          >
            <Ionicons name="restaurant" size={16} color="#111111" />
            <Text style={styles.menuButtonText}>Menu</Text>
          </TouchableOpacity>
        </View>

        {/* Floating Cart Strip (when items > 0) */}
        {totalCartCount > 0 && (
          <View style={styles.cartBottomGroup}>
            {/* Top cream bar */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => dispatch(openCartAction())}
              style={styles.cartSummaryBar}
            >
              <View style={styles.cartLeft}>
                <Ionicons name="cart" size={19} color="#D32F2F" />
                <Text style={styles.cartCountText}>
                  {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'}
                </Text>
                <Ionicons name="caret-up" size={13} color="#111111" />
              </View>

              <Text style={styles.cartTotalText}>
                ₹{totalAmount.toFixed(2)}
              </Text>
            </TouchableOpacity>

            {/* Bottom big Proceed button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => dispatch(openCartAction())}
              style={styles.proceedButton}
            >
              <Text style={styles.proceedButtonText}>Proceed</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  topSection: {
    backgroundColor: '#FFFDF5',
    paddingTop: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0ECE0',
  },
  repeatHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8DDB8',
  },
  repeatHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 1.2,
    marginHorizontal: 12,
  },
  repeatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  offersScrollView: {
    marginTop: 14,
  },
  offersContent: {
    paddingHorizontal: 16,
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECECE6',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: 220,
  },
  offerIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFB800',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  offerText: {
    fontSize: 12,
    color: '#333333',
    lineHeight: 16,
    flex: 1,
  },
  offerBold: {
    fontWeight: '700',
    color: '#111111',
  },
  stickyFilterContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E8E8E2',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  filterRowContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  mainListSection: {
    backgroundColor: '#FFFFFF',
  },
  noResultsContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  noResultsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginTop: 10,
  },
  noResultsSubtitle: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    marginTop: 4,
  },
  floatingBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: '#EAEAE2',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111111',
    fontWeight: '500',
    paddingVertical: 0,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBEBE6',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 46,
    marginLeft: 10,
    gap: 6,
  },
  menuButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
  },
  cartBottomGroup: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 8,
  },
  cartSummaryBar: {
    backgroundColor: THEME.colors.cartBarBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#E8DCB8',
  },
  cartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cartCountText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
  cartTotalText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
  proceedButton: {
    backgroundColor: THEME.colors.primaryAccent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 0.2,
  },
});
