import { FC, useEffect } from 'react';
import {
  Navbar,
  ProductCategory,
  HeroSection,
  ProductCategoryList,
} from '@/components/home';
import { IHomePageConfig } from '@/types/HomePageConfig';

const Home: FC<{ homeScreenData: IHomePageConfig | null }> = ({
  homeScreenData,
}) => {
  return (
    <div>
      <Navbar />
      <ProductCategory />
      <HeroSection homeScreenData={homeScreenData} />
      <ProductCategoryList homeScreenData={homeScreenData} />
    </div>
  );
};

export default Home;
