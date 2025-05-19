'use client';
import React, { FC, useRef } from 'react';
import { View, Text, ScrollView, Button } from 'tamagui';
import ProductCard from './ProductCard';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { IHomePageConfig } from '@/types/HomePageConfig';
import { IProduct } from '@/types/products';
import { startCase } from 'lodash-es';

interface CategoryGroup {
  categoryId: string;
  categoryName: string;
  products: IProduct[];
}

const ProductCategoryList: FC<{ homeScreenData: IHomePageConfig | null }> = ({
  homeScreenData,
}) => {
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
      const product = _product;

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
    <ScrollView padding='$1'>
      {categoryGroups.map((category, index) => (
        <View key={category.categoryId} marginBottom='$4'>
          <Text
            fontSize='$5'
            fontWeight='bold'
            marginLeft='$10'
            marginBottom='$2'
          >
            {category.categoryName}
          </Text>
          <View flexDirection='row' alignItems='center'>
            <Button
              onPress={() => scrollBy(index, -200)}
              chromeless
              icon={<FaArrowLeft />}
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
                  key={(product._id || '').toString()}
                  product={product}
                />
              ))}
            </ScrollView>

            <Button
              onPress={() => scrollBy(index, 200)}
              chromeless
              icon={<FaArrowRight />}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default ProductCategoryList;
