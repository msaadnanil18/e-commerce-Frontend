'use client';

import AddressList from '@/components/checkout/AddressList';
import CustomerSideBar from '@/components/customers/CustomerSideBar';
import Navbar from '@/components/navbar';
import { useScreen } from '@/hook/useScreen';
import { FC } from 'react';
import { ScrollView, YStack } from 'tamagui';

const ManageAddress: FC = () => {
  const screen = useScreen();
  return (
    <div className='page-container'>
      <div className='navbar'>
        <Navbar />
      </div>
      <div className={screen.xs ? 'admin-container' : 'customer-container'}>
        <CustomerSideBar />
        <ScrollView scrollbarWidth='thin'>
          <YStack
            padding='$5'
            {...(screen.xs
              ? {
                  marginTop: '$4',
                }
              : {})}
          >
            <AddressList disableDiliveryAddressButton />
          </YStack>
        </ScrollView>
      </div>
    </div>
  );
};

export default ManageAddress;
