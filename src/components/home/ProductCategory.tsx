import { FC } from 'react';
import { Card, Image, Text } from 'tamagui';
import { View, styled } from '@tamagui/core';
import { useDarkMode } from '../../hook/useDarkMode';

const ProductCategory: FC = () => {
  const isDark = useDarkMode();

  const Categories = styled(View, {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  });

  const CategoryItem = styled(View, {
    alignItems: 'center',
  });

  const CategoryImage = styled(Image, {
    width: 64,
    height: 64,
    borderRadius: 32,
  });

  const CategoryText = styled(Text, {
    marginTop: 8,
    fontSize: 12,
  });
  return (
    <Card
      bordered
      backgroundColor='$cardBackground'
      margin='$3'
      padding='$4'
      borderRadius='$2'
    >
      <Categories>
        <CategoryItem>
          <Image
            source={{
              width: 64,
              height: 64,
              uri: 'https://res.cloudinary.com/dmkkl6bcz/image/upload/v1736524736/f9ac2cbc-14cb-4130-8781-826b1f6ba009-removebg-preview_jmks1d.png',
            }}
          />
          <CategoryText>Electronics</CategoryText>
        </CategoryItem>
        <CategoryItem>
          <CategoryImage
            source={{
              width: 64,
              height: 64,
              uri: 'https://res.cloudinary.com/dmkkl6bcz/image/upload/v1736524736/f9ac2cbc-14cb-4130-8781-826b1f6ba009-removebg-preview_jmks1d.png',
            }}
          />
          <CategoryText>Fashion</CategoryText>
        </CategoryItem>
        <CategoryItem>
          <CategoryImage
            source={{
              width: 64,
              height: 64,
              uri: 'https://res.cloudinary.com/dmkkl6bcz/image/upload/v1736524506/codeapps_adobestock_562069694-removebg-preview_i572qo.png',
            }}
          />
          <CategoryText>Home</CategoryText>
        </CategoryItem>
        <CategoryItem>
          <CategoryImage
            source={{
              width: 64,
              height: 64,
              uri: 'https://res.cloudinary.com/dmkkl6bcz/image/upload/v1736524018/WhatsApp_Image_2024-12-29_at_20.19.53-removebg-preview_ma0hfh.png',
            }}
          />
          <CategoryText>Beauty</CategoryText>
        </CategoryItem>
      </Categories>
    </Card>
  );
};

export default ProductCategory;
