import { IProduct } from '@/types/products';
import React, { FC } from 'react';
import { Tabs, YStack, Text, XStack } from 'tamagui';

const ProductSpecification: FC<{ product: IProduct | null }> = ({
  product,
}) => {
  return (
    <YStack
    //className='max-w-6xl px-8 pb-12'
    >
      <Tabs
        defaultValue='details'
        orientation='horizontal'
        flexDirection='column'
      >
        <Tabs.List backgroundColor='$gray2' borderRadius='$2'>
          <Tabs.Tab value='details'>
            <Text fontSize='$4' fontWeight='bold' padding='$2'>
              Product Details
            </Text>
          </Tabs.Tab>
          <Tabs.Tab value='specs'>
            <Text fontSize='$4' fontWeight='bold' padding='$2'>
              Specifications
            </Text>
          </Tabs.Tab>
        </Tabs.List>

        {/* Product Details */}
        <Tabs.Content value='details' p='$4'>
          <YStack space='$4'>
            <Text fontSize='$5' fontWeight='bold'>
              About this item
            </Text>
            <Text>{product?.description}</Text>

            <YStack space='$2' marginTop='$4'>
              <Text fontSize='$4' fontWeight='bold'>
                Features
              </Text>
              <YStack space='$2'>
                {[
                  'Durable construction',
                  'Premium materials',
                  'Versatile design',
                  'Easy to maintain',
                ].map((feature, idx) => (
                  <XStack key={idx} space='$2' alignItems='center'>
                    <Text color='$green9'>✓</Text>
                    <Text>{feature}</Text>
                  </XStack>
                ))}
              </YStack>
            </YStack>
          </YStack>
        </Tabs.Content>

        <Tabs.Content value='specs' p='$4'>
          <YStack space='$4'>
            <Text fontSize='$5' fontWeight='bold'>
              Product Specifications
            </Text>

            <YStack space='$2'>
              <XStack flexWrap='wrap'>
                <YStack width='50%' padding='$2'>
                  <Text fontWeight='bold'>Dimensions</Text>
                  <Text>{`${product?.physicalAttributes?.dimensions?.length} × ${product?.physicalAttributes?.dimensions?.width} × ${product?.physicalAttributes?.dimensions?.height} ${product?.physicalAttributes?.dimensions?.dimensionUnit}`}</Text>
                </YStack>

                <YStack width='50%' padding='$2'>
                  <Text fontWeight='bold'>Weight</Text>
                  <Text>{`${product?.physicalAttributes?.weight} ${
                    product?.physicalAttributes?.weightUnit || 'g'
                  }`}</Text>
                </YStack>

                <YStack width='50%' padding='$2'>
                  <Text fontWeight='bold'>Brand</Text>
                  <Text>{product?.sellerSpecificDetails?.brand || 'N/A'}</Text>
                </YStack>

                <YStack width='50%' padding='$2'>
                  <Text fontWeight='bold'>Manufacturer</Text>
                  <Text>
                    {product?.sellerSpecificDetails?.manufacturer || 'N/A'}
                  </Text>
                </YStack>

                <YStack width='50%' padding='$2'>
                  <Text fontWeight='bold'>HSN Code</Text>
                  <Text>{product?.hsnCode}</Text>
                </YStack>

                <YStack width='50%' padding='$2'>
                  <Text fontWeight='bold'>Tax</Text>
                  <Text>
                    {product?.taxType === 'inclusive'
                      ? 'Inclusive'
                      : 'Exclusive'}
                  </Text>
                </YStack>
              </XStack>
            </YStack>

            <YStack space='$2' marginTop='$4'>
              <Text fontSize='$4' fontWeight='bold'>
                Packaging
              </Text>
              <Text>
                {product?.sellerSpecificDetails?.packaging ||
                  'Standard packaging'}
              </Text>
            </YStack>

            <YStack space='$2' marginTop='$4'>
              <Text fontSize='$4' fontWeight='bold'>
                Service Terms
              </Text>
              <Text>
                {product?.sellerSpecificDetails?.serviceTerms ||
                  'Standard service terms apply'}
              </Text>
            </YStack>
          </YStack>
        </Tabs.Content>
      </Tabs>
    </YStack>
  );
};

export default ProductSpecification;
