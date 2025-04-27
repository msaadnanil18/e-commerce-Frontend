import { FC } from 'react';
import {
  Navbar,
  ProductCategory,
  HeroSection,
  ProductCategoryList,
} from '@/components/home';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/states/store/store';

const Home: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Fetch user details on page load
    //ispatch(fetchUser());
  }, [dispatch]);
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
