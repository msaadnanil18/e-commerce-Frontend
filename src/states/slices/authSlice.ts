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

  if (!token) return null;

  try {
    const decoded: IUser & { exp: number } = jwtDecode(token);
    const now = Date.now() / 1000;

    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem('sessionToken');
      return null;
    }

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
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    validateSession: (state) => {
      const user = getUserFromToken();

      if (!user) {
        state.user = null;
        state.isAuthenticated = false;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('sessionToken');
        }
      } else {
        state.user = user;
        state.isAuthenticated = true;
      }
    },
  },
});

export const { setUser, logout, validateSession, setLoading } =
  authSlice.actions;
export default authSlice.reducer;
