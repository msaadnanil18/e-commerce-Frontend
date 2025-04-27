import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        darkBgbutton: '#0d0c0c',
        ligthBgbutton: '#F5F3E7',
        darkHover: '#292929',
        primary: '#FFA500',
        lightHover: '#f2e9e9',
        darkBg: '#050404',
        // ligthBg: '#ffffff',
        // darkBg: '#08111E',
        ligthBg: '#F8F8F8',
      },
    },
  },
  plugins: [],
} satisfies Config;
