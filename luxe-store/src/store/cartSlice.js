import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],    // [{ id, qty }]
  },
  reducers: {
    addToCart(state, action) {
      const existing = state.items.find(i => i.id === action.payload);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ id: action.payload, qty: 1 });
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    changeQty(state, action) {
      const { id, delta } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
          state.items = state.items.filter(i => i.id !== id);
        }
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, changeQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
