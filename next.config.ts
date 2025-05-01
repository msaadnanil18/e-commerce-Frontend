// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   webpack: (config) => {
//     return config;
//   },
// };

// export default nextConfig;

// import { withTamagui } from '@tamagui/next-plugin';

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

// export default withTamagui({
//   config: './tamagui.config.ts',
//   components: ['tamagui'],
//   importsWhitelist: ['@tamagui/animations-react-native'],
//   logTimings: true,
//   disableExtraction: process.env.NODE_ENV === 'development',
//   // Your existing Next.js config
//   ...nextConfig,
// });

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
