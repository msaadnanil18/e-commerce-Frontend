'use client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaMoon, FaSun } from 'react-icons/fa';
import { toggleTheme } from '@/states/slices/themeSlice';
import { RootState } from '@/states/store/store';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);

  return (
    <div
      className='relative inline-flex items-center cursor-pointer'
      onClick={() => dispatch(toggleTheme())}
    >
      <div
        className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-all ${
          theme.mode === 'DARK' ? 'bg-gray-700' : ''
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center transform transition-transform ${
            theme.mode === 'DARK' ? 'translate-x-6' : ''
          }`}
        >
          {theme.mode === 'DARK' ? (
            <FaMoon size={12} className='text-gray-900' />
          ) : (
            <FaSun size={12} className='text-yellow-500' />
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
