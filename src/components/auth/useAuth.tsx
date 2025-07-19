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
  const searchParam = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);

  const redirect = searchParam.get('redirect') || '/';

  const saveUserData = useCallback(
    async (token: string, role?: string) => {
      if (!token) return;
      setLoading(true);
      const [err, result] = await ServiceErrorManager(
        GoogleLoginService({
          data: { token, selectedRole: role },
        }),
        {
          successMessage: 'You are successfully login',
        }
      );
      setLoading(false);
      if (err || !result) {
        router.push('/');
        return;
      }

      if (result.redirect) {
        router.push(result.redirect);
        dispatch(
          setUser({ ...result.user, sessionToken: result.sessionToken })
        );
        // if (typeof window !== 'undefined') {
        //   localStorage.setItem('sessionToken', result.sessionToken);
        // }
        return result.redirect;
      }

      dispatch(setUser(result.user));

      if (typeof window !== 'undefined') {
        localStorage.setItem('sessionToken', result.sessionToken);
      }
    },
    [dispatch, router]
  );

  const handleLogin = useCallback(
    async (role?: string) => {
      const user = await auth.signinPopup({
        extraQueryParams: {
          prompt: 'select_account',
        },
      });
      if (user?.access_token) {
        return await saveUserData(user.access_token, role);
      }
    },
    [auth, saveUserData]
  );

  const login = async (role?: string) => {
    const result = await handleLogin(role);
    if (!result) {
      //   await signOutRedirect();
      router.replace(redirect);
    }
  };

  const signOutRedirect = async () => {
    auth.removeUser();

    const logoutUrl = `${
      process.env.NEXT_PUBLIC_CONGNITO_DOMAIN
    }/logout?client_id=${
      process.env.NEXT_PUBLIC_CONGNITO_CLIENT_ID
    }&logout_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_LOGOUT_URI!)}`;

    window.location.href = logoutUrl;
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
