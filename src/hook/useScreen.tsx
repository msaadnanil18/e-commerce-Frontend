'use client';

import React, { useState, useEffect } from 'react';

const breakpoints = {
  xs: 480,
  sm: 768,
  md: 1024,
  lg: 1280,
  xl: 1536,
};

type ScreenSize = {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  width: number;
};

const getScreenSize = (width: number): ScreenSize => ({
  xs: width < breakpoints.sm,
  sm: width >= breakpoints.sm && width < breakpoints.md,
  md: width >= breakpoints.md && width < breakpoints.lg,
  lg: width >= breakpoints.lg && width < breakpoints.xl,
  xl: width >= breakpoints.xl,
  width: width,
});

export const useScreen = (): ScreenSize => {
  const [screen, setScreen] = useState<ScreenSize>(() => getScreenSize(1024));

  useEffect(() => {
    const updateSize = () => {
      if (typeof window !== 'undefined') {
        setScreen(getScreenSize(window.innerWidth));
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return screen;
};
