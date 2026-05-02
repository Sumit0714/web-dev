import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: false,
    toast: '',
    cartOpen: false,
  },
  reducers: {
    toggleDark(state) {
      state.darkMode = !state.darkMode;
    },
    setToast(state, action) {
      state.toast = action.payload;
    },
    openCart(state) {
      state.cartOpen = true;
    },
    closeCart(state) {
      state.cartOpen = false;
    },
  },
});

export const { toggleDark, setToast, openCart, closeCart } = uiSlice.actions;
export default uiSlice.reducer;
