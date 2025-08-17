'use client';
import RenderDriveFile from '@/components/appComponets/fileupload/RenderDriveFile';
import { useScreen } from '@/hook/useScreen';
import { IProduct } from '@/types/products';
import React, { FC, useState, useRef } from 'react';
import { XStack, YStack, ScrollView, Button } from 'tamagui';

const ProductImage: FC<{
  product: IProduct | null;
  handleImageClick?: (r?: number) => void;
  selectedVariant: number;
}> = ({ product, handleImageClick, selectedVariant }) => {
  const screen = useScreen();
  const [selectedImage, setSelectedImage] = useState(product?.thumbnail);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const attachments: Array<any> = product
    ? [product.thumbnail, ...(product.variants[selectedVariant].media || [])]
    : [];

  const currentIndex = attachments.findIndex((img) => img === selectedImage);

  const handleSwipe = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current;
      const minSwipeDistance = 50;

      if (
        distance > minSwipeDistance &&
        currentIndex < attachments.length - 1
      ) {
        setSelectedImage(attachments[currentIndex + 1]);
      } else if (distance < -minSwipeDistance && currentIndex > 0) {
        setSelectedImage(attachments[currentIndex - 1]);
      }
    }

    // Reset refs
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <YStack paddingLeft={screen.xs ? undefined : '$3'}>
      <XStack
        alignItems='center'
        height='24rem'
        marginBottom='$3'
        onTouchStart={(e: any) => {
          if (screen.xs) touchStartX.current = e.touches[0].clientX;
        }}
        onTouchMove={(e: any) => {
          if (screen.xs) touchEndX.current = e.touches[0].clientX;
        }}
        onTouchEnd={() => {
          if (screen.xs) handleSwipe();
        }}
      >
        <YStack marginLeft={screen.xs ? undefined : '$4'} flex={1}>
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
            className='max-w-96 max-h-96 object-contain'
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
              maxWidth={100}
            >
              <RenderDriveFile
                MediaHTMLAttributes={{ controls: false }}
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
