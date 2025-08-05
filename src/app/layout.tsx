import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './app.scss';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import { EcommarceName } from '@/helpers/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // Better performance
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap', // Better performance
});

// Enhanced SEO metadata
export const metadata: Metadata = {
  // Basic metadata
  title: {
    default: EcommarceName(),
    template: `%s | ${EcommarceName()}`, // For page-specific titles
  },
  description: `Welcome to ${EcommarceName()} - Your premier destination for quality products. Discover amazing deals, fast shipping, and exceptional customer service.`,

  // Keywords and categories
  keywords: [
    'ecommerce',
    'online shopping',
    'quality products',
    'fast delivery',
    'best deals',
    EcommarceName().toLowerCase(),
  ],

  // Author and creator info
  authors: [{ name: EcommarceName() }],
  creator: EcommarceName(),
  publisher: EcommarceName(),

  // Robots and indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Open Graph metadata for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com',
    title: EcommarceName(),
    description: `Welcome to ${EcommarceName()} - Your premier destination for quality products.`,
    siteName: EcommarceName(),
    images: [
      {
        url: '/og-image.jpg', // Add your Open Graph image
        width: 1200,
        height: 630,
        alt: `${EcommarceName()} - Online Shopping`,
        type: 'image/jpeg',
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: EcommarceName(),
    description: `Welcome to ${EcommarceName()} - Your premier destination for quality products.`,
    images: ['/twitter-image.jpg'], // Add your Twitter image
    creator: '@yourhandle', // Replace with your Twitter handle
    site: '@yourhandle', // Replace with your Twitter handle
  },

  // Icons and manifest
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },

  // Web app manifest
  manifest: '/manifest.json',

  // Additional metadata
  applicationName: EcommarceName(),
  referrer: 'origin-when-cross-origin',
  category: 'ecommerce',

  // Verification (add your verification codes)
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    // other: ['your-other-verification-codes'],
  },

  // Additional meta tags
  other: {
    'theme-color': '#ffffff',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': EcommarceName(),
    'msapplication-TileColor': '#ffffff',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' dir='ltr'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin=''
        />

        <link rel='dns-prefetch' href='//fonts.googleapis.com' />

        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: EcommarceName(),
              url: process.env.NEXT_PUBLIC_SITE_URL,
              logo: process.env.NEXT_PUBLIC_ECOMMERCE_LOGO,
              description: `${EcommarceName()} - Your premier destination for quality products.`,
              sameAs: [],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91',
                contactType: 'Customer Service',
                availableLanguage: 'English',
              },
            }),
          }}
        />

        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: EcommarceName(),
              url: process.env.NEXT_PUBLIC_SITE_URL,
              description: `${EcommarceName()} - Your premier destination for quality products.`,
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href='#main-content'
          className='sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50'
        >
          Skip to main content
        </a>

        <Providers>
          <div id='main-content'>{children}</div>
          <Toaster
            position='top-center'
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
