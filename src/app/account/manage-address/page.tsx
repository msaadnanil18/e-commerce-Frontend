'use client';

import AddressList from '@/components/checkout/AddressList';
import CustomerSideBar from '@/components/customers/CustomerSideBar';
import { useScreen } from '@/hook/useScreen';
import { FC } from 'react';
import { ScrollView, YStack } from 'tamagui';

const ManageAddress: FC = () => {
  const screen = useScreen();
  return (
    <div className='admin-container'>
      <CustomerSideBar />
      <ScrollView>
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
  );
};

export default ManageAddress;
