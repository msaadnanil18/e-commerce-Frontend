'use client';
import { FC, useState, Dispatch, SetStateAction } from 'react';
import { YStack, ScrollView } from 'tamagui';
import Navbar from '../navbar';
import { IProduct } from '@/types/products';
import { useScreen } from '@/hook/useScreen';
import ProductImageSection from './ProductImageSection';
import ProductDetailsSection from './ProductDetailsSection';
import ProductSpecification from './ProductSpecification';
import CustomerReviews from './ CustomerReviews';

const ItemDetails: FC<{
  product: IProduct;
  setProduct: Dispatch<SetStateAction<IProduct | null>>;
}> = (props) => {
  const { product, setProduct } = props;
  const screen = useScreen();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(
    product?.quantityRules?.step ||
      product?.quantityRules?.predefined?.[0] ||
      product?.quantityRules?.min ||
      1
  );

  const isMobile = screen.xs;
  const variants = product.variants || [];

  return (
    <YStack flex={1}>
      <Navbar />
      <ScrollView padding={isMobile ? '$3' : '$4'}>
        <YStack
          flexDirection={isMobile ? 'column' : 'row'}
          gap={isMobile ? '$4' : '$6'}
        >
          <ProductImageSection
            product={product}
            setProduct={setProduct}
            selectedVariant={selectedVariant}
            quantity={quantity}
            setQuantity={setQuantity}
            isMobile={isMobile}
          />

          <ProductDetailsSection
            product={product}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
            isMobile={isMobile}
            variants={variants}
          />
        </YStack>

        <YStack space='$6' marginTop='$6'>
          <ProductSpecification product={product} />
          <CustomerReviews product={product} />
        </YStack>
      </ScrollView>
    </YStack>
  );
};

export default ItemDetails;
