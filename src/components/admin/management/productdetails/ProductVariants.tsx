'use client';

import { IProduct } from '@/types/products';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { YStack, XStack, Card, Text, Separator, Button } from 'tamagui';

const ProductVariants: FC<{
  product: IProduct | null;
  selectedVariant: number;
  setSelectedVariant: Dispatch<SetStateAction<number>>;
}> = ({ product, selectedVariant, setSelectedVariant }) => {
  const variants = product?.variants || [];
  const currentVariant = variants[selectedVariant] || {};
  return (
    <YStack marginTop='$5'>
      {variants.length > 0 && (
        <YStack space='$2'>
          <Text fontSize='$4' fontWeight='bold'>
            Options
          </Text>
          <XStack flexWrap='wrap' space='$2'>
            {variants.map((variant, idx) => (
              <Button
                key={idx}
                size='$3'
                variant={selectedVariant === idx ? 'outlined' : undefined}
                onPress={() => setSelectedVariant(idx)}
              >
                {variant.variantName}
              </Button>
            ))}
          </XStack>
        </YStack>
      )}

      <Card
        padding='$3'
        borderRadius='$2'
        marginTop='$2'
        borderColor='$gray5'
        borderWidth={1}
      >
        <YStack space='$2'>
          <XStack justifyContent='space-between'>
            <Text fontWeight='bold'>Selected Variant</Text>
            <Text color='$primary' fontWeight='bold'>
              SKU: {variants[selectedVariant]?.sku}
            </Text>
          </XStack>

          <Separator />

          <XStack flexWrap='wrap'>
            {variants[selectedVariant]?.attributes?.map(
              (attr: Record<string, any>, idx: number) => (
                <YStack key={idx} width='50%' padding='$1'>
                  <Text fontSize='$3' color='$gray10'>
                    {attr.key}
                  </Text>
                  <Text fontWeight='medium'>{attr.value}</Text>
                </YStack>
              )
            )}
          </XStack>

          <XStack marginTop='$2' space='$4' alignItems='center'>
            <YStack>
              <Text fontSize='$3' color='$gray10'>
                Availability
              </Text>
              <Text
                color={
                  variants[selectedVariant]?.inventory > 5
                    ? '$green9'
                    : variants[selectedVariant]?.inventory > 0
                    ? '$yellow9'
                    : variants[selectedVariant]?.isMadeOnDemand
                    ? '$blue9'
                    : '$red9'
                }
                fontWeight='bold'
              >
                {variants[selectedVariant]?.inventory > 5
                  ? 'In Stock'
                  : variants[selectedVariant]?.inventory > 0
                  ? `Low Stock (${variants[selectedVariant]?.inventory} left)`
                  : variants[selectedVariant]?.isMadeOnDemand
                  ? 'Made to Order'
                  : 'Out of Stock'}
              </Text>
            </YStack>

            {variants[selectedVariant]?.isMadeOnDemand && (
              <YStack>
                <Text fontSize='$3' color='$gray10'>
                  Production Time
                </Text>
                <Text>
                  {variants[selectedVariant]?.shippingTimeline || 'N/A'} days
                </Text>
              </YStack>
            )}
          </XStack>
        </YStack>
        <XStack alignItems='center' space='$2'>
          <Text fontSize='$4' fontWeight='bold'>
            Delivery:
          </Text>
          <Text>
            {currentVariant.isMadeOnDemand
              ? `Made on demand (${
                  currentVariant.shippingTimeline || 'Timeframe varies'
                })`
              : currentVariant.inventory > 0
              ? 'In stock, ready to ship'
              : 'Out of stock'}
          </Text>
        </XStack>
      </Card>
    </YStack>
  );
};

export default ProductVariants;
