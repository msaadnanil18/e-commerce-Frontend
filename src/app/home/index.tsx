import { FC } from 'react';
import {
  Navbar,
  ProductCategory,
  HeroSection,
  ProductCategoryList,
} from '@/components/home';

const Home: FC = () => {
  return (
    <div>
      <Navbar />
      <ProductCategory />
      <HeroSection />
      <ProductCategoryList />
    </div>
  );
};

export default Home;
