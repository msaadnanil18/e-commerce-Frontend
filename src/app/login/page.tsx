import AuthenticationUI from '@/components/login';
import React, { FC } from 'react';
import { EcommarceName } from '@/helpers/utils';

export async function generateMetadata() {
  return {
    title: `Login to Your Account | ${EcommarceName()}`,
    description: `Securely log in to your ${EcommarceName()} account to manage orders, track deliveries, and access exclusive offers.`,
    keywords: [
      'Login',
      'Sign In',
      'Account Login',
      'Customer Login',
      'E-commerce Login',
      'Login Page',
      'Access Account',
      'Track Orders',
      'Manage Orders',
    ],
    openGraph: {
      title: `Login to Your Account | ${EcommarceName()}`,
      description: `Access your ${EcommarceName()} account to manage orders, track deliveries, and view your order history securely.`,
      url: '/login',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Login to Your Account | ${EcommarceName()}`,
      description: `Log in securely to manage your ${EcommarceName()} orders, delivery details, and account information.`,
    },
  };
}

const LoginPage: FC = () => {
  return <AuthenticationUI />;
};

export default LoginPage;
