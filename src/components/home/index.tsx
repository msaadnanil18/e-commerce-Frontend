'use client';
import Navbar from '../navbar';
import ProductCategory from './ProductCategory';
import HeroSection from './HeroSection';
import ProductCategoryList from './ProductCategoryList';
import { FC } from 'react';
import { useScreen } from '@/hook/useScreen';
import { ScrollView, View, YStack } from 'tamagui';
import SearchInput from '@/components/navbar/SearchInput';
import Loading from '../loading/Loading';
import { useHomePageContextContext } from './HomePageContext';
import EmptyState from '../appComponets/Empty/EmptyState';
import { MdInventory2 } from 'react-icons/md';

const Home: FC = () => {
  const { loading, homeScreenData } = useHomePageContextContext();
  const screen = useScreen();

  if (loading) return <Loading />;

  return (
    <div>
      <Navbar />

      {screen.xs && (
        <View
          padding='$3'
          backgroundColor='$background'
          //@ts-ignore
          position='sticky'
          zIndex={1000}
          top={0}
          borderBottomWidth={1}
          borderBottomColor='$borderColor'
        >
          <SearchInput />
        </View>
      )}

      {!homeScreenData || !homeScreenData.productcategory.length ? (
        <View flex={2} minHeight='calc(100vh - 74px)'>
          <EmptyState
            icon={<MdInventory2 size={60} />}
            title='No products available'
            description='There are currently no products in this page'
          />
        </View>
      ) : (
        <ScrollView
          flex={1}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
          }}
        >
          <YStack space='$4'>
            <ProductCategory
              productcategory={homeScreenData?.productcategory}
            />

            <View paddingHorizontal='$3'>
              <HeroSection homeScreenData={homeScreenData} />
            </View>

            <ProductCategoryList homeScreenData={homeScreenData} />
          </YStack>
        </ScrollView>
      )}
    </div>
  );
};

export default Home;
