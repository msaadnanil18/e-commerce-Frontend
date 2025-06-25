import { FC } from 'react';
import { Card, Image, Text } from 'tamagui';
import { View, styled } from '@tamagui/core';
import { IProductCategory } from '@/types/productCategory';
import { kebabCase, startCase } from 'lodash-es';
import RenderDriveFile from '../appComponets/fileupload/RenderDriveFile';

const ProductCategory: FC<{
  productcategory?: Array<IProductCategory | null>;
}> = ({ productcategory }) => {
  const Categories = styled(View, {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  });

  const CategoryItem = styled(View, {
    alignItems: 'center',
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
        {(productcategory || []).map((category, index) => (
          <CategoryItem key={index}>
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
      </Categories>
    </Card>
  );
};

export default ProductCategory;
