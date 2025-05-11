'use client';
import RenderDriveFile from '@/components/appComponets/fileupload/RenderDriveFile';
import { IProduct } from '@/types/products';
import React, { FC, useState } from 'react';
import { XStack, YStack, ScrollView, Button } from 'tamagui';

const ProductImage: FC<{
  product: IProduct | null;
  handleImageClick?: (r?: number) => void;
  selectedVariant: number;
}> = ({ product, handleImageClick, selectedVariant }) => {
  const [selectedImage, setSelectedImage] = useState(product?.thumbnail);

  const attachments: Array<{}> = product
    ? [product.thumbnail, ...(product.variants[selectedVariant].media || [])]
    : [];

  return (
    <YStack paddingLeft='$3'>
      <XStack alignItems='center' height='24rem' marginBottom='$3'>
        <YStack marginLeft='$4' flex={1}>
          <RenderDriveFile
            MediaHTMLAttributes={{
              controls: false,
              autoPlay: true,
              loop: true,
            }}
            file={selectedImage}
            onClick={() => {
              handleImageClick?.();
            }}
            className='max-w-full max-h-96 object-contain'
          />
        </YStack>
      </XStack>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack space='$2'>
          {(attachments || []).map((media, index) => (
            <Button
              backgroundColor={media === selectedImage ? '$primary' : ''}
              key={index}
              onPress={() => setSelectedImage(media)}
              className='w-20 h-40'
            >
              <RenderDriveFile
                MediaHTMLAttributes={{ controls: false }}
                key={index}
                file={media}
                className='w-full h-full object-cover'
              />
            </Button>
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
};

export default ProductImage;
