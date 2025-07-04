// import { createTamagui, createTheme } from '@tamagui/core';
// import { tokens, themes } from '@tamagui/themes';
// import { themes as customTheme } from './theme';

// const darkTheme = createTheme({
//   ...themes.dark,
//   background: '#0d0c0c',
//   cardBackground: '#050404',
//   color: '#EAEAEA',
//   primary: '#0A84FF',
//   secondary: '#03DAC6',
//   colorHover: '#FFFFFF',
//   backgroundHover: '#292929',
//   colorPress: '#CCCCCC',
//   backgroundPress: '#191919',
//   borderColor: '#333333',
// });

// const lightTheme = createTheme({
//   ...themes.light,
//   background: '#ffffff',
//   //color: '#333333',
//   primary: '#007272',
//   colorHover: '#222222',
//   backgroundHover: '#E0DBCC',
//   colorPress: '#111111',
//   backgroundPress: '#D6CDBB',
//   cardBackground: '#EDE8D5',
// });

// const config = createTamagui({
//   customTheme,
//   themes: {
//     light: lightTheme,
//     dark: darkTheme,
//   },
//   tokens,
//   shorthands: {
//     p: 'padding',
//     m: 'margin',
//     bg: 'backgroundColor',
//   },
// });

// export type AppConfig = typeof config;
// declare module '@tamagui/core' {
//   interface TamaguiCustomConfig extends AppConfig {}
// }

// export default config;

import { createTamagui, createTheme } from '@tamagui/core';
import { tokens, themes } from '@tamagui/themes';
import { themes as customTheme } from './theme';
import { createAnimations } from '@tamagui/animations-react-native';

const darkTheme = createTheme({
  ...themes.dark,
  background: '#0d0c0c',
  cardBackground: '#050404',
  color: '#EAEAEA',
  primary: '#FFA500',
  secondary: '#FFB347',
  colorHover: '#FFFFFF',
  backgroundHover: '#3A3A3A',
  colorPress: '#CCCCCC',
  backgroundPress: '#424242',
  borderColor: '#555555',
  linkColor: '#007AFF',
});

const lightTheme = createTheme({
  ...themes.light,
  background: '#FFFFFF',
  color: '#333333',
  primary: '#FFA500',
  secondary: '#FFB347',
  colorHover: '#222222',
  backgroundHover: '#FFE5B4',
  colorPress: '#111111',
  backgroundPress: '#FFD27F',
  cardBackground: '#F8F8F8',
  linkColor: '#007AFF',
});

const animations = createAnimations({
  // animation configuration
  bouncy: {
    type: 'spring',
    damping: 10,
    mass: 1,
    stiffness: 100,
  },
  // other animations...
});

const config = createTamagui({
  customTheme,
  animations: animations,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  tokens,
  shorthands: {
    p: 'padding',
    m: 'margin',
    bg: 'backgroundColor',
  },
});

export type AppConfig = typeof config;
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
