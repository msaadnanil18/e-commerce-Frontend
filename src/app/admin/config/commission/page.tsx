'use client';

import Commission from '@/components/admin/config/commissionConfig';
import AdminSidebar from '@/components/admin/organism/AdminSidebar';
import { FC } from 'react';

const CommissionConfig: FC = () => {
  return (
    <div className='admin-container'>
      <AdminSidebar />
      <Commission />
    </div>
  );
};

export default CommissionConfig;
