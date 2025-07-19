import Checkout from '@/components/checkout';
import Navbar from '@/components/navbar';
import { EcommarceName } from '@/helpers/utils';
import React, { FC } from 'react';

export async function generateMetadata() {
  return {
    title: `${EcommarceName()}: Checkout - Secure Payment`,
    description: `Complete your order securely on ${EcommarceName()}. Fast, reliable, and hassle-free checkout for all your shopping needs.`,
  };
}

const CheckoutPage: FC = () => {
  return (
    <div className='h-screen'>
      <Navbar
        showSearchInput={false}
        showRoleChange={false}
        showMobileMenu={false}
      />
      <Checkout />
    </div>
  );
};

export default CheckoutPage;
