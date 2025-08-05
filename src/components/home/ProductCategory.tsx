import React, { FC, RefObject, useRef } from 'react';
import { Card, Image, ScrollView, Text, XStack } from 'tamagui';
import { View, styled } from '@tamagui/core';
import { IProductCategory } from '@/types/productCategory';
import { kebabCase, startCase, toLower } from 'lodash-es';
import RenderDriveFile from '../appComponets/fileupload/RenderDriveFile';
import { useRouter } from 'next/navigation';
import { useScreen } from '@/hook/useScreen';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const ProductCategory: FC<{
  productcategory?: Array<IProductCategory | null>;
}> = ({ productcategory }) => {
  const router = useRouter();
  const screen = useScreen();
  const scrollRefs = useRef<Record<any, any>>({});

  const Categories = styled(View, {
    width: '100%',
    marginBottom: 16,
  });

  const CategoryItem = styled(View, {
    alignItems: 'center',
    marginHorizontal: screen.xs ? 18 : 30,
    minWidth: 80,
  });

  const CategoryText = styled(Text, {
    marginTop: 8,
    fontSize: 12,
    cursor: 'pointer',
    textAlign: 'center',
    hoverStyle: {
      color: '$linkColor',
    },
  });

  const Categorys = () => (
    <ScrollView
      ref={(el) => {
        scrollRefs.current = el as Record<any, any>;
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
      }}
      style={{
        width: '100%',
      }}
    >
      {(productcategory || []).map((category, index) => (
        <CategoryItem
          onPress={() => {
            router.push(
              `${category?._id}?category=${toLower(category?.title)}`
            );
          }}
          key={index}
        >
          {category?.thumbnail ? (
            <RenderDriveFile
              file={category?.thumbnail as any}
              style={{
                width: '64px',
                height: '64px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
          ) : (
            <Image
              source={{
                width: 64,
                height: 64,
                uri: 'https://res.cloudinary.com/dmkkl6bcz/image/upload/v1736524736/f9ac2cbc-14cb-4130-8781-826b1f6ba009-removebg-preview_jmks1d.png',
              }}
            />
          )}

          <CategoryText>{startCase(kebabCase(category?.title))}</CategoryText>
        </CategoryItem>
      ))}
    </ScrollView>
  );

  return (
    <Card
      bordered
      backgroundColor='$cardBackground'
      margin='$3'
      padding='$4'
      borderRadius='$2'
    >
      <Categories>
        {screen.xs ? (
          <ProductScrollwithArrow scrollRefs={scrollRefs}>
            <Categorys />
          </ProductScrollwithArrow>
        ) : (
          <Categorys />
        )}
      </Categories>
    </Card>
  );
};

export default ProductCategory;

const ProductScrollwithArrow: FC<{
  scrollRefs: RefObject<Record<any, any>>;
  children: React.ReactNode;
}> = ({ scrollRefs, children }) => {
  return (
    <XStack>
      <View paddingLeft={0} marginTop='$5'>
        <FaArrowLeft
          onClick={() => {
            scrollRefs.current.scrollTo({
              x: scrollRefs.current.scrollLeft + -200,
            });
          }}
        />
      </View>
      {children}
      <View paddingLeft={0} marginTop='$5'>
        <FaArrowRight
          onClick={() => {
            scrollRefs.current.scrollTo({
              x: scrollRefs.current.scrollLeft + 200,
            });
          }}
        />
      </View>
    </XStack>
  );
};
