'use client';
import React, { FC, useMemo } from 'react';
import Regitrations from '../Regitrations';
import { useSearchParams } from 'next/navigation';

const AdminLogin: FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return <Regitrations {...{ token }} />;
};

export default AdminLogin;
