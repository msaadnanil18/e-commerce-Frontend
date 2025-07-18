import Cart from '@/components/cart';
import { EcommarceName } from '@/helpers/utils';
import React, { FC } from 'react';

export async function generateMetadata() {
  return {
    title: `Shopping Cart | ${EcommarceName()}`,
    description: `Viewcart Online Store in India. Check Viewcart Prices, Ratings & Reviews at ${EcommarceName()}`,
  };
}

const Carts: FC = () => {
  return <Cart />;
};

export default Carts;
