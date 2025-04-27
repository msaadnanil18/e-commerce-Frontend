'use client';

import React from 'react';
import { AuthProvider, AuthProviderProps } from 'react-oidc-context';

const cognitoAuthConfig: AuthProviderProps = {
  authority: process.env.NEXT_PUBLIC_CONGNITO_AUTHORITY!,
  client_id: process.env.NEXT_PUBLIC_CONGNITO_CLIENT_ID!,
  redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
  response_type: 'code',
  scope: 'aws.cognito.signin.user.admin email openid profile',
  post_logout_redirect_uri: process.env.NEXT_PUBLIC_LOGOUT_URI,
};

const OIDCProvider = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
};

export default OIDCProvider;
