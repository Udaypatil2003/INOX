import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { THEME } from '../constants/theme';
import { CATEGORIES } from '../constants/categories';
import Toolbar from '../components/Toolbar';
import CategoryTile from '../components/CategoryTile';
import RepeatItemCard from '../components/RepeatItemCard';
import foodService from '../services/foodService';
import { useSelector, useDispatch } from 'react-redux';
import {
  increment as incrementAction,
  decrement as decrementAction,
  openCart as openCartAction,
} from '../features/cart/cartStore';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const quantities = useSelector((state) => state.cart.quantities);

  // Data from service
  const popularItems = useMemo(() => foodService.getPopularItems(), []);
  const repeatItems = useMemo(() => foodService.getRepeatItems(), []);
  const itemsMap = useMemo(() => foodService.getItemsMap(), []);

  // Total cart count & amount
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

  const handleCategoryPress = (categoryId) => {
    navigation.navigate('Listing', { initialCategory: categoryId });
  };

  const handleViewAllMenu = () => {
    navigation.navigate('Listing', { initialCategory: null });
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

      {/* Fixed Toolbar */}
      <Toolbar
        title="Order Snacks"
        subtitle="PVR Elan Mercado, Sec 80, Gurugram"
        showBack={false}
        cartCount={totalCartCount}
        onCartPress={() => dispatch(openCartAction())}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>PVR INOX EXCLUSIVE</Text>
          </View>
          <Text style={styles.heroTitle}>Delivered Right To Your Seat</Text>
          <Text style={styles.heroSubtitle}>
            Fresh gourmet popcorn, hot combos & chilled beverages
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleViewAllMenu}
            style={styles.orderNowButton}
          >
            <Text style={styles.orderNowText}>Order Now / View Full Menu</Text>
            <Ionicons name="arrow-forward" size={16} color="#111111" />
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>EXPLORE CATEGORIES</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRowContent}
          >
            {CATEGORIES.map((cat) => (
              <CategoryTile
                key={cat.id}
                category={cat}
                onPress={handleCategoryPress}
              />
            ))}
          </ScrollView>
        </View>

        {/* Bank Offers Strip */}
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offersContent}
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

        {/* Repeat Again Carousel */}
        {repeatItems.length > 0 && (
          <View style={styles.section}>
            <View style={styles.repeatHeaderContainer}>
              <View style={styles.headerLine} />
              <Text style={styles.repeatHeaderTitle}>REPEAT AGAIN?</Text>
              <View style={styles.headerLine} />
            </View>
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
              contentContainerStyle={styles.carouselContent}
            />
          </View>
        )}

        {/* Popular Items Carousel */}
        {popularItems.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.titleRow}>
                <Ionicons name="flame" size={18} color="#D9534F" />
                <Text style={styles.sectionTitle}>POPULAR ITEMS</Text>
              </View>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={popularItems}
              keyExtractor={(item) => item.itemId}
              renderItem={({ item }) => (
                <RepeatItemCard
                  item={item}
                  quantity={quantities[item.itemId] || 0}
                  onIncrement={() => dispatch(incrementAction(item.itemId))}
                  onDecrement={() => dispatch(decrementAction(item.itemId))}
                />
              )}
              contentContainerStyle={styles.carouselContent}
            />
          </View>
        )}

        <View style={{ height: totalCartCount > 0 ? 120 : 40 }} />
      </ScrollView>

      {/* Floating Bottom Cart Bar */}
      {totalCartCount > 0 && (
        <View style={styles.floatingBottomContainer}>
          <View style={styles.cartBottomGroup}>
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

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => dispatch(openCartAction())}
              style={styles.proceedButton}
            >
              <Text style={styles.proceedButtonText}>Proceed</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  scrollContent: {
    paddingBottom: 24,
  },
  heroBanner: {
    backgroundColor: THEME.colors.cartBarBackground,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F0E2BA',
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: THEME.colors.primaryAccent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 8,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    lineHeight: 24,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  orderNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.primaryAccent,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  orderNowText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
  },
  section: {
    marginTop: 18,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: 1,
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
  categoryRowContent: {
    paddingHorizontal: 16,
  },
  carouselContent: {
    paddingHorizontal: 16,
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
  floatingBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    paddingBottom: 10,
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
