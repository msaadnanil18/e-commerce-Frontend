import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder';
import * as Colors from '@tamagui/colors';

const lightPalette = [
  'hsla(0, 0%, 99%, 1)', // Near white
  'hsla(30, 96%, 95%, 1)', // Very light orange
  'hsla(30, 96%, 90%, 1)', // Soft orange
  'hsla(30, 96%, 85%, 1)',
  'hsla(30, 96%, 80%, 1)',
  'hsla(30, 96%, 75%, 1)',
  'hsla(30, 96%, 70%, 1)',
  'hsla(30, 96%, 65%, 1)',
  'hsla(30, 96%, 60%, 1)', // Medium orange
  'hsla(30, 96%, 55%, 1)',
  'hsla(30, 96%, 50%, 1)', // Rich light orange
  'hsla(30, 96%, 45%, 1)',
];

const darkPalette = [
  'hsla(30, 30%, 10%, 1)', // Darker orange-brown
  'hsla(30, 30%, 15%, 1)',
  'hsla(30, 30%, 20%, 1)',
  'hsla(30, 30%, 25%, 1)',
  'hsla(30, 30%, 30%, 1)',
  'hsla(30, 30%, 35%, 1)',
  'hsla(30, 30%, 40%, 1)',
  'hsla(30, 30%, 45%, 1)',
  'hsla(30, 30%, 50%, 1)',
  'hsla(30, 30%, 55%, 1)',
  'hsla(30, 30%, 60%, 1)', // Lighter shade for text contrast
  'hsla(30, 30%, 65%, 1)',
];

const lightShadows = {
  shadow1: 'rgba(0,0,0,0.04)',
  shadow2: 'rgba(0,0,0,0.08)',
  shadow3: 'rgba(0,0,0,0.16)',
  shadow4: 'rgba(0,0,0,0.24)',
  shadow5: 'rgba(0,0,0,0.32)',
  shadow6: 'rgba(0,0,0,0.4)',
};

const darkShadows = {
  shadow1: 'rgba(0,0,0,0.2)',
  shadow2: 'rgba(0,0,0,0.3)',
  shadow3: 'rgba(0,0,0,0.4)',
  shadow4: 'rgba(0,0,0,0.5)',
  shadow5: 'rgba(0,0,0,0.6)',
  shadow6: 'rgba(0,0,0,0.7)',
};

const builtThemes = createThemes({
  base: {
    palette: {
      dark: darkPalette,
      light: lightPalette,
    },
    extra: {
      light: {
        ...Colors.orange,
        ...lightShadows,
        shadowColor: lightShadows.shadow1,
      },
      dark: {
        ...Colors.orangeDark,
        ...darkShadows,
        shadowColor: darkShadows.shadow1,
      },
    },
  },
  accent: {
    palette: {
      dark: [
        'hsla(30, 96%, 40%, 1)', // Deep orange
        'hsla(30, 96%, 42%, 1)',
        'hsla(30, 96%, 45%, 1)',
        'hsla(30, 96%, 48%, 1)',
        'hsla(30, 96%, 50%, 1)',
        'hsla(30, 96%, 53%, 1)',
        'hsla(30, 96%, 55%, 1)',
        'hsla(30, 96%, 57%, 1)',
        'hsla(30, 96%, 60%, 1)',
        'hsla(30, 96%, 63%, 1)',
        'hsla(30, 96%, 66%, 1)',
      ],
      light: [
        'hsla(30, 96%, 65%, 1)',
        'hsla(30, 96%, 67%, 1)',
        'hsla(30, 96%, 70%, 1)',
        'hsla(30, 96%, 72%, 1)',
        'hsla(30, 96%, 75%, 1)',
        'hsla(30, 96%, 78%, 1)',
        'hsla(30, 96%, 80%, 1)',
        'hsla(30, 96%, 82%, 1)',
        'hsla(30, 96%, 85%, 1)',
        'hsla(30, 96%, 88%, 1)',
        'hsla(30, 96%, 90%, 1)',
      ],
    },
  },
});

export type Themes = typeof builtThemes;

// this is optional, but saves client-side JS bundle size by leaving out themes on client.
// tamagui automatically hydrates themes from css back into JS for you and the tamagui
// bundler plugins automate setting TAMAGUI_ENVIRONMENT.

export const themes: Themes =
  process.env.TAMAGUI_ENVIRONMENT === 'client' &&
  process.env.NODE_ENV === 'production'
    ? ({} as any)
    : (builtThemes as any);

//     import { themes } from './themes'
// import { defaultConfig } from '@tamagui/config/v4'

// export const config = createTamagui({
//   themes,
//   ...defaultConfig,
// })
