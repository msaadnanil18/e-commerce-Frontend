'use client';
import RoleAssign from '@/components/admin/RoleAssign';
import AdminSidebar from '@/components/admin/organism/AdminSidebar';
import React, { FC } from 'react';

const RolesAssign: FC = () => {
  return (
    <div className='admin-container'>
      <AdminSidebar />
      <RoleAssign />
    </div>
  );
};

export default RolesAssign;
