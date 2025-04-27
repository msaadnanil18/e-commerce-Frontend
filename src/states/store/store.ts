import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../slices/cartSlice';
import themeReducer from '../slices/themeSlice';
import authSlice from '../slices/authSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    theme: themeReducer,
    user: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
