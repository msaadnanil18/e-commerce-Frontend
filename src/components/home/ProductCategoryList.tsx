'use client';
import React, { FC, useRef } from 'react';
import { View, Text, ScrollView, Button } from 'tamagui';
import ProductCard from './ProductCard';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { IHomePageConfig } from '@/types/HomePageConfig';
import { IProduct } from '@/types/products';
import { startCase } from 'lodash-es';
import { useWishlistToggle } from './useWishlistToggle';
import { useRouter } from 'next/navigation';
import { useScreen } from '@/hook/useScreen';

interface CategoryGroup {
  categoryId: string;
  categoryName: string;
  products: IProduct[];
}

const ProductCategoryList: FC<{ homeScreenData: IHomePageConfig | null }> = ({
  homeScreenData,
}) => {
  const screen = useScreen();
  const router = useRouter();
  const { toggleWishlist, wishlistLoading } = useWishlistToggle();
  const scrollRefs = useRef<Record<number, any>>({});

  const scrollBy = (index: number, offset: number) => {
    if (scrollRefs.current[index]) {
      scrollRefs.current[index].scrollTo({
        x: scrollRefs.current[index].scrollLeft + offset,
        animated: true,
      });
    }
  };

  const groupProductsByCategory = (): CategoryGroup[] => {
    if (
      !homeScreenData?.featuredProducts ||
      !homeScreenData.featuredProducts.length
    ) {
      return [];
    }

    const categoryMap: Record<string, CategoryGroup> = {};

    homeScreenData.featuredProducts.forEach((_product) => {
      const product = _product as IProduct;

      const categoryId = (product.category.title || '').toString();

      if (!categoryMap[categoryId]) {
        categoryMap[categoryId] = {
          categoryId,
          categoryName: startCase(categoryId),
          products: [],
        };
      }

      categoryMap[categoryId].products.push(product);
    });

    return Object.values(categoryMap).sort((a, b) =>
      a.categoryName.localeCompare(b.categoryName)
    );
  };

  const categoryGroups = groupProductsByCategory();

  return (
    <>
      {categoryGroups.map((category, index) => (
        <View key={category?.categoryId || index} marginBottom='$4'>
          <Text
            fontSize={screen.xs ? '$3' : '$5'}
            fontWeight='bold'
            marginLeft={screen.xs ? '$5' : '$10'}
            marginBottom={screen.xs ? '$1' : '$2'}
          >
            {category.categoryName}
          </Text>
          <View flexDirection='row' alignItems='center'>
            <Button
              onPress={() => scrollBy(index, -200)}
              chromeless
              icon={<FaArrowLeft />}
              padding='$1.5'
              // margin='$2'
            />

            <ScrollView
              horizontal
              ref={(el) => {
                scrollRefs.current[index] = el;
              }}
              showsHorizontalScrollIndicator={false}
            >
              {category.products.map((product) => (
                <ProductCard
                  wishlistLoading={wishlistLoading}
                  toggleWishlist={toggleWishlist}
                  isResponsive={screen.xs}
                  productOnClick={(product) => {
                    router.push(
                      `/product-details/${product._id}?name=${product.name}&description=${product.description}`
                    );
                  }}
                  key={(product._id || '').toString()}
                  product={product}
                />
              ))}
            </ScrollView>

            <Button
              onPress={() => scrollBy(index, 200)}
              chromeless
              icon={<FaArrowRight />}
              padding='$1.5'
              // margin='$2'
            />
          </View>
        </View>
      ))}
    </>
  );
};

export default ProductCategoryList;
