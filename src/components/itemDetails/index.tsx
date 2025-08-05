'use client';
import { FC, useState, Dispatch, SetStateAction, useEffect, use } from 'react';
import { YStack, ScrollView } from 'tamagui';
import Navbar from '../navbar';
import { useScreen } from '@/hook/useScreen';
import ProductImageSection from './ProductImageSection';
import ProductDetailsSection from './ProductDetailsSection';
import ProductSpecification from './ProductSpecification';
import CustomerReviews from './ CustomerReviews';
import { ServiceErrorManager } from '@/helpers/service';
import { AnonymousProductDetailsService } from '@/services/products';
import { IProduct } from '@/types/products';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store/store';
import { Spinner, XStack, Text } from 'tamagui';
import { useSearchParams } from 'next/navigation';
import { decryptData } from '@/helpers/ cryptoUtils';

const ItemDetails: FC<{
  product: IProduct;
  setProduct: Dispatch<SetStateAction<IProduct | null>>;
}> = (props) => {
  const { product, setProduct } = props;
  const searchParams = useSearchParams();
  const screen = useScreen();

  const index = product.variants.findIndex(
    (variant) => variant._id === searchParams.get('variant')
  );

  const [selectedVariant, setSelectedVariant] = useState(
    index === -1 ? 0 : index
  );

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

interface ProductDetailsPageProps {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ name?: string; description?: string }>;
}

const ProductDetails: FC<ProductDetailsPageProps> = ({
  params,
  searchParams,
}) => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.user);
  const unwrappedParams = use(params);
  // const unwrappedSearchParams = use(searchParams);

  // const r = async () => {
  //   console.log(await unwrappedParams, '___unwrappedParams___');
  //   console.log(unwrappedSearchParams, '___unwrappedSearchParams____');
  //   const dataDecrypt = await decryptData(
  //     String((unwrappedSearchParams as any).product),
  //     '685e6feed65d45d46822eeca'
  //   );
  //   console.log(dataDecrypt);
  // };
  // useEffect(() => {
  //   r();
  // }, []);
  const fetchProductDetails = async () => {
    if (!unwrappedParams.productId) return;
    setIsLoading(true);
    const [_, response] = await ServiceErrorManager(
      AnonymousProductDetailsService({
        params: {
          ...(user ? { user: user?._id } : {}),
          _id: unwrappedParams.productId,
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
      <YStack>
        <Navbar />
        <XStack justifyContent='center' alignItems='center' height='100vh'>
          <Spinner size='large' />
          <Text marginLeft='$2'>Loading product details...</Text>
        </XStack>
      </YStack>
    );

  if (!product) return <Text>Product not found</Text>;

  return <ItemDetails {...{ product, setProduct }} />;
};

export default ProductDetails;
