import React, { FC } from 'react';
import OrdersList from '@/components/customers/orders';
import Navbar from '@/components/navbar';

const MyOrdersListPage: FC = () => {
  return (
    <div className='h-screen'>
      <Navbar />
      <OrdersList />
    </div>
  );
};

export default MyOrdersListPage;
