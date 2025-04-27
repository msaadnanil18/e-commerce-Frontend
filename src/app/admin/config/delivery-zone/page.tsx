'use client';

import DeliveryChargesConfig from '@/components/admin/config/DeliveryCharges/DeliveryChargesConfig';
import AdminSidebar from '@/components/admin/organism/AdminSidebar';
import { FC } from 'react';

const DeliveryCharges: FC = () => {
  return (
    <div className='admin-container'>
      <AdminSidebar />
      <DeliveryChargesConfig />
    </div>
  );
};

export default DeliveryCharges;
