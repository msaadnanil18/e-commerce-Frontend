'use client';

import { RootState } from '@/states/store/store';
import { useSelector } from 'react-redux';

export const useDarkMode = () => {
  const theme = useSelector((state: RootState) => state.theme);

  return theme.mode === 'DARK';
};
