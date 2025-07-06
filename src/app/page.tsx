'use client';

import dynamic from 'next/dynamic';
import Loading from '@/components/loading/Loading';
import { FC } from 'react';
import { HomePageConfigProvider } from '@/components/home/HomePageContext';

const HomeScreen = dynamic(() => import('../components/home'), {
  loading: () => <Loading />,
  ssr: false,
});

const Home: FC = () => {
  return (
    <HomePageConfigProvider>
      <HomeScreen />;
    </HomePageConfigProvider>
  );
};

export default Home;
