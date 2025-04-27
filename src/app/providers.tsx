'use client';
import Loading from '@/components/loading/Loading';
import { Provider } from '@/states/Provider';
import React, { Suspense } from 'react';
import { TamaguiProvider, Stack, Theme } from '@tamagui/web';
import tamaguiConfig from '../../tamagui.config';
import { useDarkMode } from '@/hook/useDarkMode';
import OIDCProvider from '@/components/auth/AuthProvider';
import ProtectedRoute from '@/components/middleware/ProtectedRoute';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<Loading />}>
      <OIDCProvider>
        <Provider>
          <TamaguiProvider config={tamaguiConfig}>
            <Bootstrap>
              <ProtectedRoute>{children}</ProtectedRoute>
            </Bootstrap>
          </TamaguiProvider>
        </Provider>
      </OIDCProvider>
    </Suspense>
  );
};

const Bootstrap = ({ children }: { children: React.ReactNode }) => {
  const isDark = useDarkMode();

  return (
    <Theme name={isDark ? 'dark' : 'light'}>
      <Stack backgroundColor='$background'>{children}</Stack>
    </Theme>
  );
};
