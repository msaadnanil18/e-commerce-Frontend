'use client';
import Loading from '@/components/loading/Loading';
import { Provider } from '@/states/Provider';
import React, { useEffect } from 'react';
import { TamaguiProvider, Stack, Theme } from '@tamagui/web';
import tamaguiConfig from '../../tamagui.config';
import { useDarkMode } from '@/hook/useDarkMode';
import OIDCProvider from '@/components/auth/AuthProvider';
import ProtectedRoute from '@/components/middleware/ProtectedRoute';
import dynamic from 'next/dynamic';
import { useDispatch } from 'react-redux';

import { usePathname } from 'next/navigation';
import { validationSession } from '@/states/authThunks';
import { AppDispatch } from '@/states/store/store';
import { useSessionRefresher } from '@/hook/useSessionRefresher';

const FallbackLoading = dynamic(
  () =>
    Promise.resolve(({ children }: { children: React.ReactNode }) => children),
  {
    loading: () => <Loading />,
    ssr: false,
  }
);

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <FallbackLoading>
      <OIDCProvider>
        <Provider>
          <TamaguiProvider config={tamaguiConfig}>
            <Bootstrap>
              <ProtectedRoute>{children}</ProtectedRoute>
            </Bootstrap>
          </TamaguiProvider>
        </Provider>
      </OIDCProvider>
    </FallbackLoading>
  );
};

const Bootstrap = ({ children }: { children: React.ReactNode }) => {
  const isDark = useDarkMode();
  useSessionRefresher();
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/') {
      dispatch(validationSession());
    }
  }, [pathname]);

  return (
    <Theme name={isDark ? 'dark' : 'light'}>
      <Stack
        backgroundColor='$background'
        role='application'
        aria-label='Main application content'
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          id='app-root'
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {children}
        </div>

        <div
          id='announcements'
          aria-live='polite'
          aria-atomic='true'
          style={{
            position: 'absolute',
            left: '-10000px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        />

        <div id='skip-links' />
      </Stack>
    </Theme>
  );
};
