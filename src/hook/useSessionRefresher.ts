import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, logout } from '../states/slices/authSlice';
import { UserSwitchRoleService } from '@/services/auth';
import { jwtDecode } from 'jwt-decode';
import { IUser } from '@/types/auth';

export const useSessionRefresher = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(async () => {
      const token = localStorage.getItem('sessionToken');
      if (!token) return;

      try {
        const decoded: IUser & { exp: number } = jwtDecode(token);
        const { data } = await UserSwitchRoleService({
          data: { payload: { selectedRole: decoded.activeRole } },
        });

        if (data?.user) {
          const { sessionToken: newToken, user } = data;
          localStorage.setItem('sessionToken', newToken);
          dispatch(setUser(user));
        } else {
          dispatch(logout());
        }
      } catch (err) {
        dispatch(logout());
      }
    }, 60 * 15000);

    return () => clearInterval(interval);
  }, []);
};
