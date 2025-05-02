'use client';

import AdminSidebar from '@/components/admin/organism/AdminSidebar';
import Sellers from '@/components/admin/seller';
import React, { FC } from 'react';

const AdminSeller: FC = () => {
  return (
    <div className='admin-container'>
      <AdminSidebar />
      <Sellers />
    </div>
  );
};

export default AdminSeller;
