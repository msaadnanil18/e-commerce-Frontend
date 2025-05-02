'use client';
import React, { FC } from 'react';
import Regitrations from '../Regitrations';
import { useSearchParams } from 'next/navigation';

const SuperAdminLogin: FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  return <Regitrations {...{ token }} />;
};

export default SuperAdminLogin;
