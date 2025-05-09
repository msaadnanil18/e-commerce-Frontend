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
import { validateSession } from '@/states/slices/authSlice';
import { usePathname } from 'next/navigation';

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
  const dispatch = useDispatch();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/') {
      dispatch(validateSession());
    }
  }, [dispatch, pathname]);

  return (
    <Theme name={isDark ? 'dark' : 'light'}>
      <Stack backgroundColor='$background'>{children}</Stack>
    </Theme>
  );
};
