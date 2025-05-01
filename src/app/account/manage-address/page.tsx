'use client';

import AddressList from '@/components/checkout/AddressList';
import CustomerSideBar from '@/components/customers/CustomerSideBar';
import { FC } from 'react';
import { ScrollView, YStack } from 'tamagui';

const ManageAddress: FC = () => {
  return (
    <div className='admin-container'>
      <CustomerSideBar />
      <ScrollView>
        <YStack padding='$5'>
          <AddressList disableDiliveryAddressButton />
        </YStack>
      </ScrollView>
    </div>
  );
};

export default ManageAddress;
