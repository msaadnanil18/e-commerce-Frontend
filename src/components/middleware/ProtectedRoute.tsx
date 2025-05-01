'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store/store';
import { Routes } from '@/constant/permissions';

const protectedRoutes = ['/seller-registration', '/cart'];

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const cleanedPathname = pathname.replace(/\/[a-f\d]{24}$/, '');

  const routerPermission = Routes[cleanedPathname];

  if (
    routerPermission?.some((perm) => !user.user?.permissions.includes(perm)) &&
    !user?.isAuthenticated
  ) {
    router.push('/unauthorized');
  }

  useEffect(() => {
    if (protectedRoutes.includes(pathname) && !user?.isAuthenticated) {
      router.replace(`/login?redirect=${pathname}`);
    }
  }, [pathname, user, router]);

  if (protectedRoutes.includes(pathname) && !user?.isAuthenticated) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
