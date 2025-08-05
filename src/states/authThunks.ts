import { jwtDecode } from 'jwt-decode';
import { setUser, logout, setLoading } from './slices/authSlice';
import { UserSwitchRoleService } from '@/services/auth';
import { IUser } from '@/types/auth';
import { AppDispatch } from './store/store';

export const validationSession = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));

  try {
    const token = localStorage.getItem('sessionToken');
    if (!token) {
      dispatch(logout());
      return;
    }

    const decoded: IUser & { exp: number } = jwtDecode(token);
    const now = Date.now() / 1000;

    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem('sessionToken');
      dispatch(logout());
      return;
    }

    const { data } = await UserSwitchRoleService({
      data: { payload: { selectedRole: decoded.activeRole } },
    });

    if (data?.user) {
      const { sessionToken: newToken, user } = data;
      localStorage.setItem('sessionToken', newToken);
      dispatch(setUser(user));
    }
  } catch {
    dispatch(logout());
  } finally {
    dispatch(setLoading(false));
  }
};
