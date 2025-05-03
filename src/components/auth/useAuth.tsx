'use client';

import { ServiceErrorManager } from '@/helpers/service';
import { GoogleLoginService } from '@/services/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth as cognitoUseAuth } from 'react-oidc-context';
import { setUser, logout } from '@/states/slices/authSlice';
import { RootState } from '@/states/store/store';

export const useAuth = () => {
  const auth = cognitoUseAuth();
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);

  const redirect = searchParams.get('redirect') || '/';

  const saveUserData = useCallback(
    async (token?: string, role: string = 'customer') => {
      if (!token) return;
      setLoading(true);
      const [, result] = await ServiceErrorManager(
        GoogleLoginService({
          method: 'POST',
          data: { token, selectedRole: role },
        }),
        {
          successMessage: 'success',
          failureMessage: 'Error while login',
        }
      );
      setLoading(false);
      dispatch(setUser(result.user));

      // localStorage.setItem('sessionToken', result.sessionToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sessionToken', result.sessionToken);
      }
    },
    [dispatch, router]
  );

  const handleLogin = useCallback(
    async (role: string) => {
      const user = await auth.signinPopup({
        extraQueryParams: {
          prompt: 'select_account',
        },
      });
      await saveUserData(user.access_token, role);
    },
    [auth, saveUserData]
  );

  const login = async (role: 'seller' | 'customer') => {
    await handleLogin(role);
    await signOutRedirect();
    router.replace(redirect);
  };

  const signOutRedirect = async () => {
    auth.removeUser();
    router.push(
      `${process.env.NEXT_PUBLIC_CONGNITO_DOMAIN}/logout?client_id=${
        process.env.NEXT_PUBLIC_CONGNITO_CLIENT_ID
      }&logout_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_LOGOUT_URI!)}`
    );

    // setTimeout(() => {
    //   auth.removeUser();
    // }, 1000);
  };
  const logOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('token');
    }
    dispatch(logout());
    auth.revokeTokens();
    signOutRedirect();
  };

  return { login, loading, logOut, user };
};

export default useAuth;
