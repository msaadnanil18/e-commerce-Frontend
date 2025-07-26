import Cart from '@/components/cart';
import { EcommarceName } from '@/helpers/utils';
import React, { FC } from 'react';

export async function generateMetadata() {
  return {
    title: `Your Shopping Cart | ${EcommarceName()}`,
    description: `Review the items in your shopping cart at ${EcommarceName()}. Check prices, ratings, and reviews before proceeding to checkout.`,
    keywords: [
      'Shopping Cart',
      'Online Cart',
      'E-commerce Cart',
      'View Cart',
      'Checkout',
      'Buy Online',
      'Cart Summary',
    ],
    openGraph: {
      title: `Your Shopping Cart | ${EcommarceName()}`,
      description: `Easily view and manage the products in your cart at ${EcommarceName()}. Review prices, quantities, and get ready to complete your order.`,
      url: '/cart',
      type: 'website',
    },
  };
}

const Carts: FC = () => {
  return (
    <div className=' h-screen'>
      <Cart />
    </div>
  );
};

export default Carts;
