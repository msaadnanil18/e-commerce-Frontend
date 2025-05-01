// 'use client';

// import { useState, useEffect } from 'react';

// const breakpoints = {
//   xs: 480,
//   sm: 768,
//   md: 1024,
//   lg: 1280,
//   xl: 1536,
// };

// type ScreenSize = {
//   xs: boolean;
//   sm: boolean;
//   md: boolean;
//   lg: boolean;
//   xl: boolean;
// };

// const getScreenSize = (width: number): ScreenSize => ({
//   xs: width < breakpoints.sm,
//   sm: width >= breakpoints.sm && width < breakpoints.md,
//   md: width >= breakpoints.md && width < breakpoints.lg,
//   lg: width >= breakpoints.lg && width < breakpoints.xl,
//   xl: width >= breakpoints.xl,
// });

// export const useScreen = (): ScreenSize => {
//   const [screen, setScreen] = useState<ScreenSize>(() =>
//     getScreenSize(window.innerWidth)
//   );

//   useEffect(() => {
//     const handleResize = () => setScreen(getScreenSize(window.innerWidth));
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return screen;
// };

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
    // Default fallback for SSR (e.g., desktop size)
    getScreenSize(1024)
  );

  useEffect(() => {
    // Ensure window is defined
    const updateSize = () => {
      if (typeof window !== 'undefined') {
        setScreen(getScreenSize(window.innerWidth));
      }
    };

    // Run on mount
    updateSize();

    // Add listener
    window.addEventListener('resize', updateSize);

    // Clean up
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return screen;
};
