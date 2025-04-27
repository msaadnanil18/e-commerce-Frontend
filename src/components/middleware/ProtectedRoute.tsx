'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store/store';

const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/seller-registration',
  '/cart',
  '/admin/seller',
];

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const rolePermissionRoutes = [];

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
