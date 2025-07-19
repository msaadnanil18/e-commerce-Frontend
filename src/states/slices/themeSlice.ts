import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'LIGHT' | 'DARK';

interface ThemeState {
  mode: Theme;
}

const initialState: ThemeState = {
  mode:
    typeof window !== 'undefined'
      ? (localStorage.getItem('theme') as 'LIGHT' | 'DARK')
      : 'LIGHT',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'LIGHT' ? 'DARK' : 'LIGHT';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.mode);
      }
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.mode = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
