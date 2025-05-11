'use client';
import { FC, Dispatch, SetStateAction } from 'react';
import { XStack, YStack, Text, Button, Separator, View, Card } from 'tamagui';
import { IProduct } from '@/types/products';
import PriceFormatter from '../appComponets/PriceFormatter/PriceFormatter';

interface ProductDetailsSectionProps {
  product: IProduct;
  selectedVariant: number;
  setSelectedVariant: Dispatch<SetStateAction<number>>;
  isMobile: boolean;
  variants: any[];
}

const ProductDetailsSection: FC<ProductDetailsSectionProps> = ({
  product,
  selectedVariant,
  setSelectedVariant,
  isMobile,
  variants,
}) => {
  const currentVariant = variants[selectedVariant] || {};

  return (
    <YStack space='$4' flex={1} width={isMobile ? '100%' : '55%'}>
      <Text fontSize='$4' fontWeight='bold'>
        {product.name}
      </Text>

      <Separator />

      <XStack
        justifyContent='space-between'
        alignItems='center'
        flexWrap={isMobile ? 'wrap' : 'nowrap'}
      >
        {currentVariant.discount ? (
          <View>
            <XStack gap='$3' alignItems='center'>
              <PriceFormatter value={currentVariant.price} crossed />
              <Text color='$green9' fontWeight='bold'>
                {currentVariant.discount}% off
              </Text>
            </XStack>
            <Text
              fontSize={isMobile ? '$4' : '$5'}
              fontWeight='bold'
              color='$primary'
            >
              <PriceFormatter value={currentVariant?.originalPrice} />
            </Text>
          </View>
        ) : (
          <Text
            fontSize={isMobile ? '$4' : '$5'}
            fontWeight='bold'
            color='$primary'
          >
            <PriceFormatter value={currentVariant?.originalPrice} />
          </Text>
        )}

        <Text fontSize='$3' color='$gray10' marginTop={isMobile ? '$2' : '$0'}>
          SKU: {currentVariant.sku}
        </Text>
      </XStack>

      <Text
        fontSize={isMobile ? '$2' : '$3'}
        color='$gray11'
        lineHeight={isMobile ? '$3' : '$4'}
      >
        {product.description}
      </Text>

      {variants.length > 0 && (
        <YStack space='$2'>
          <Text fontSize={isMobile ? '$3' : '$4'} fontWeight='bold'>
            Options
          </Text>
          <XStack flexWrap='wrap' gap='$2'>
            {variants.map((variant, idx) => (
              <Button
                key={idx}
                size={isMobile ? '$2' : '$3'}
                variant={selectedVariant === idx ? 'outlined' : undefined}
                onPress={() => setSelectedVariant(idx)}
                marginBottom='$1'
              >
                {variant.variantName}
              </Button>
            ))}
          </XStack>
        </YStack>
      )}

      <Card
        padding={isMobile ? '$2' : '$3'}
        borderRadius='$2'
        borderColor='$gray5'
        borderWidth={1}
      >
        <YStack space='$2'>
          <XStack justifyContent='space-between' flexWrap='wrap'>
            <Text fontWeight='bold'>Selected Variant</Text>
            <Text color='$primary' fontWeight='bold' fontSize='$3'>
              SKU: {variants[selectedVariant]?.sku}
            </Text>
          </XStack>

          <Separator />

          <XStack flexWrap='wrap'>
            {variants[selectedVariant]?.attributes?.map(
              (attr: Record<string, any>, idx: number) => (
                <YStack
                  key={idx}
                  width={isMobile ? '100%' : '50%'}
                  padding='$1'
                  marginBottom='$1'
                >
                  <Text fontSize='$3' color='$gray10'>
                    {attr.key}
                  </Text>
                  <Text fontWeight='medium'>{attr.value}</Text>
                </YStack>
              )
            )}
          </XStack>

          <XStack
            marginTop='$2'
            gap='$4'
            alignItems='center'
            flexWrap={isMobile ? 'wrap' : 'nowrap'}
          >
            <YStack marginBottom={isMobile ? '$2' : '$0'}>
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
      </Card>
    </YStack>
  );
};

export default ProductDetailsSection;
