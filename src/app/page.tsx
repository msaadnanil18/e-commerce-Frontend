'use client';

import dynamic from 'next/dynamic';
import Loading from '@/components/loading/Loading';
import { FC } from 'react';

const HomeScreen = dynamic(() => import('./home'), {
  loading: () => <Loading />,
  ssr: false,
});

const Home: FC = () => {
  return <HomeScreen />;
};

export default Home;
