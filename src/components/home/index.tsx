import Navbar from '../navbar';
import ProductCategory from './ProductCategory';
import HeroSection from './HeroSection';
import ProductCategoryList from './ProductCategoryList';
import { FC } from 'react';
import { useScreen } from '@/hook/useScreen';
import { View } from 'tamagui';
import SearchInput from '@/components/navbar/SearchInput';
import Loading from '../loading/Loading';
import { useHomePageContextContext } from './HomePageContext';

const Home: FC = () => {
  const { loading, homeScreenData } = useHomePageContextContext();
  const screen = useScreen();

  if (loading) return <Loading />;
  return (
    <div>
      <Navbar />
      {screen.xs && (
        <View
          flex={1}
          padding='$3'
          //@ts-ignore
          position='sticky'
          zIndex={1000}
          top={0}
          marginBottom='$3'
        >
          <SearchInput />
        </View>
      )}
      <ProductCategory productcategory={homeScreenData?.productcategory} />
      <HeroSection homeScreenData={homeScreenData} />
      <ProductCategoryList homeScreenData={homeScreenData} />
    </div>
  );
};

export default Home;
