'use client';
import React, { FC } from 'react';
import Regitrations from '../Regitrations';
interface SuperAdminProps {
  searchParams: { token?: string };
}

const AdminLogin: FC<SuperAdminProps> = (prosp) => {
  return <Regitrations {...prosp} />;
};

export default AdminLogin;
