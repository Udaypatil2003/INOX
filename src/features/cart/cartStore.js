import { createSlice } from '@reduxjs/toolkit';

/**
 * Redux Toolkit slice for cart quantities keyed by itemId.
 */
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    // Map of itemId -> quantity
    quantities: {},

    // Bottom Sheet modal visibility state
    isCartOpen: false,
  },
  reducers: {
    openCart(state) {
      state.isCartOpen = true;
    },
    closeCart(state) {
      state.isCartOpen = false;
    },
    increment(state, action) {
      const itemId = action.payload;
      if (!itemId) return;
      const current = state.quantities[itemId] || 0;
      state.quantities[itemId] = current + 1;
    },
    decrement(state, action) {
      const itemId = action.payload;
      if (!itemId) return;
      const current = state.quantities[itemId] || 0;
      if (current <= 1) {
        delete state.quantities[itemId];
      } else {
        state.quantities[itemId] = current - 1;
      }
    },
    setQuantity(state, action) {
      const { itemId, qty } = action.payload || {};
      if (!itemId) return;
      if (qty <= 0) {
        delete state.quantities[itemId];
      } else {
        state.quantities[itemId] = qty;
      }
    },
    clearCart(state) {
      state.quantities = {};
    },
  },
});

export const { openCart, closeCart, increment, decrement, setQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
