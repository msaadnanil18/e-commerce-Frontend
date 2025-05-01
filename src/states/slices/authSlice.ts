'use client';
import { IUser } from '@/types/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface UserState {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const getUserFromToken = (): IUser | null => {
  let token;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('sessionToken');
  }
  //localStorage.getItem('sessionToken');
  if (!token) return null;

  try {
    const decoded: IUser = jwtDecode<IUser>(token);
    return decoded;
  } catch {
    return null;
  }
};

const initialUser = getUserFromToken();

const initialState: UserState = {
  user: initialUser,
  isAuthenticated: !!initialUser,
  loading: false,
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sessionToken');
      }
      // localStorage.removeItem('sessionToken');
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
