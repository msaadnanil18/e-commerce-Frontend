'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store/store';
import { ProtectedRoutes } from '@/constant/permissions';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const pathname = usePathname();

  const cleanedPathname = pathname.replace(/\/[a-f\d]{24}$/, '');
  const requiredPermissions = ProtectedRoutes[cleanedPathname];

  useEffect(() => {
    const isProtected = Object.prototype.hasOwnProperty.call(
      ProtectedRoutes,
      cleanedPathname
    );

    if (isProtected && !user?.isAuthenticated) {
      router.replace(`/login?redirect=${pathname}`);
      return;
    }

    if (
      isProtected &&
      requiredPermissions?.length &&
      !requiredPermissions.every((perm) =>
        user?.user?.permissions.includes(perm)
      )
    ) {
      router.replace('/unauthorized');
    }
  }, [pathname, user, router, cleanedPathname, requiredPermissions]);

  const isProtected = Object.prototype.hasOwnProperty.call(
    ProtectedRoutes,
    cleanedPathname
  );

  if (isProtected && !user?.isAuthenticated) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
