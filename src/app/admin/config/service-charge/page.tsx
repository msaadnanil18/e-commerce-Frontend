'use client';

import React, { FC } from 'react';

import AdminSidebar from '@/components/admin/organism/AdminSidebar';
import ServiceChargeConfig from '@/components/admin/config/serviceCharge/ServiceChargeConfig';

const ServiceChargeManager: FC = () => {
  return (
    <div className='admin-container'>
      <AdminSidebar />
      <ServiceChargeConfig />
    </div>
  );
};

export default ServiceChargeManager;
