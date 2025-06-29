import { FC } from 'react';
import {
  Navbar,
  ProductCategory,
  HeroSection,
  ProductCategoryList,
} from '@/components/home';
import { IHomePageConfig } from '@/types/HomePageConfig';
import { useScreen } from '@/hook/useScreen';
import { View } from 'tamagui';
import SearchInput from '@/components/navbar/SearchInput';

const Home: FC<{ homeScreenData: IHomePageConfig | null }> = ({
  homeScreenData,
}) => {
  const screen = useScreen();
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
