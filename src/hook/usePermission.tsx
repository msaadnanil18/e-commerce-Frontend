'use client';

import { RootState } from '@/states/store/store';
import { useSelector } from 'react-redux';

const usePermission = () => {
  const { user } = useSelector((state: RootState) => state.user);

  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || false;
  };

  return { hasPermission };
};

export default usePermission;
