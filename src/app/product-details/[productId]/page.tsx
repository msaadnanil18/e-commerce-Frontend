'use client';
import React, { FC, useEffect, useState, use } from 'react';
import ItemDetails from '@/components/itemDetails';
import { ServiceErrorManager } from '@/helpers/service';
import { AnonymousProductDetailsService } from '@/services/products';
import { IProduct } from '@/types/products';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store/store';
import { Spinner, XStack, Text } from 'tamagui';

interface ProductDetailsPageProps {
  params: Promise<{ productId: string }>;
  searchParams: { theme?: string };
}

const ProductDetails: FC<ProductDetailsPageProps> = ({ params }) => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.user);
  const unwrappedParams = use(params);

  const fetchProductDetails = async () => {
    if (!unwrappedParams.productId) return;
    setIsLoading(true);
    const [_, response] = await ServiceErrorManager(
      AnonymousProductDetailsService({
        data: {
          payload: { user: user?._id },
          query: { _id: unwrappedParams.productId },
        },
      }),
      {}
    );
    setProduct(response);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProductDetails().catch(console.log);
  }, [unwrappedParams.productId]);

  if (isLoading)
    return (
      <XStack justifyContent='center' alignItems='center' height='100vh'>
        <Spinner size='large' />
        <Text marginLeft='$2'>Loading product details...</Text>
      </XStack>
    );

  if (!product) return <Text>Product not found</Text>;

  return <ItemDetails {...{ product, setProduct }} />;
};

export default ProductDetails;
