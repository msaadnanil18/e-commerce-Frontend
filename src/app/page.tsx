'use client';

import dynamic from 'next/dynamic';
import Loading from '@/components/loading/Loading';
import { FC, useEffect, useState } from 'react';
import { ServiceErrorManager } from '@/helpers/service';
import { ListAnonymousHomePageConfigService } from '@/services/homePageConfig';
import { IHomePageConfig } from '@/types/HomePageConfig';

const HomeScreen = dynamic(() => import('./home'), {
  loading: () => <Loading />,
  ssr: false,
});

const Home: FC = () => {
  const [homeScreenData, setHomeScreenData] = useState<IHomePageConfig | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const fetchHomePageData = async () => {
    setLoading(true);
    const [err, data] = await ServiceErrorManager(
      ListAnonymousHomePageConfigService(),
      {}
    );
    if (!err && data) {
      setHomeScreenData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHomePageData().catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return <HomeScreen homeScreenData={homeScreenData} />;
};

export default Home;
