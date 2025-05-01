'use client';

import { permissions } from '@/constant/permissions';
import { RootState } from '@/states/store/store';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

// const _routes: Record<string, string[]> = {
//   '/admin/config/commission': [permissions.CAN_VIEW_COMMISSION_CONFIGURATION],
//   //   '/dashboard': ['seller', 'admin', 'superAdmin'],
//   //   '/admin': ['admin', 'superAdmin'],
//   //   '/super-admin': ['superAdmin'],
//   // Add more routes as needed
// };

export const useProtectedRoute = () => {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const pathname = usePathname();

  const cleanedPathname = pathname.replace(/\/[a-f\d]{24}$/, '');

  const isAuthenticated = user?.isAuthenticated;
  const userPermissions = user.user?.permissions || [];

  console.log(cleanedPathname, '__pathname__');

  //   const forbiddenRoutes: Record<string, string[]> = {
  //     '/admin': ['admin', 'superAdmin'],
  //     '/seller': ['seller', 'superAdmin'],
  //     '/dashboard': ['customer', 'seller', 'admin', 'superAdmin'],
  //   };

  //const requiredRoles = _routes[pathname] || [];

  //   console.log(
  //     requiredRoles.some((r) => userPermissions.includes(r)),
  //     'pathname'
  //   );

  //   const hasRole =
  //     requiredRoles.length === 0 || requiredRoles.includes(userRole);

  return { isAuthenticated: true, hasRole: false };
};
