'use client';

import { useState, useEffect } from 'react';

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
};

const getScreenSize = (width: number): ScreenSize => ({
  xs: width < breakpoints.sm,
  sm: width >= breakpoints.sm && width < breakpoints.md,
  md: width >= breakpoints.md && width < breakpoints.lg,
  lg: width >= breakpoints.lg && width < breakpoints.xl,
  xl: width >= breakpoints.xl,
});

export const useScreen = (): ScreenSize => {
  const [screen, setScreen] = useState<ScreenSize>(() =>
    getScreenSize(window.innerWidth)
  );

  useEffect(() => {
    const handleResize = () => setScreen(getScreenSize(window.innerWidth));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screen;
};
