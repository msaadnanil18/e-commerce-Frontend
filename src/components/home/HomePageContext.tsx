'use client';

import { ListAnonymousHomePageConfigService } from '@/services/homePageConfig';
import { RootState } from '@/states/store/store';
import { IHomePageConfig } from '@/types/HomePageConfig';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useSelector } from 'react-redux';

interface HomePageContextType {
  homeScreenData: IHomePageConfig | null;
  setHomeScreenData: Dispatch<SetStateAction<IHomePageConfig | null>>;
  loading: boolean;
}

const HomePageContext = createContext<HomePageContextType | null>(null);

export const HomePageConfigProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const user = useSelector((state: RootState) => state.user);
  const [homeScreenData, setHomeScreenData] = useState<IHomePageConfig | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const fetchHomePageData = async () => {
    const { data } = await ListAnonymousHomePageConfigService({
      params: { user: user.user?._id || undefined },
    });

    if (data) {
      setHomeScreenData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHomePageData();
  }, []);

  return (
    <HomePageContext.Provider
      value={{
        homeScreenData,
        setHomeScreenData,
        loading,
      }}
    >
      {children}
    </HomePageContext.Provider>
  );
};
export const useHomePageContextContext = (): HomePageContextType => {
  const context = useContext(HomePageContext);
  if (!context) {
    throw new Error();
  }
  return context;
};
