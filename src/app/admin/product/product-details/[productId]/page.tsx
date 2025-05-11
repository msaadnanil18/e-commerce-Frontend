'use client';
import { ServiceErrorManager } from '@/helpers/service';
import { IProduct } from '@/types/products';
import React, { FC, useEffect, useState } from 'react';
import {
  View,
  Text,
  XStack,
  YStack,
  Spinner,
  Button,
  ScrollView,
  H6,
  Separator,
} from 'tamagui';
import { IoWarning, IoArrowBack } from 'react-icons/io5';
import AdminActionButtons from '@/components/admin/management/productdetails/AdminActionButtons';
import ProductInformation from '@/components/admin/management/productdetails/ProductInformation';
import { useScreen } from '@/hook/useScreen';
import ProductImage from '@/components/admin/management/productdetails/ProductImage';
import ProductVariants from '@/components/admin/management/productdetails/ProductVariants';
import { startCase } from 'lodash-es';
import ProductstatusColor from '@/components/admin/management/productdetails/ProductstatusColor';
import { ProductDetailsService } from '@/services/products';
import usePermission from '@/hook/usePermission';
import { permissions } from '@/constant/permissions';
import PriceFormatter from '@/components/appComponets/PriceFormatter/PriceFormatter';

interface ProductDetailsPageProps {
  params: { productId: string };
  searchParams: { theme?: string };
}

const ProductDetails: FC<ProductDetailsPageProps> = ({ params }) => {
  const screen = useScreen();
  const { hasPermission } = usePermission();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(0);

  const fetchProductDetails = async () => {
    if (!params?.productId) return;
    setIsLoading(true);

    const [err, response] = await ServiceErrorManager(
      ProductDetailsService({
        data: {
          query: {
            _id: params?.productId,
          },
        },
      }),
      {
        failureMessage: 'Error while fetching product details!',
      }
    );
    if (err || !response) return;
    setProduct(response);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const handleImageClick = (index: number = 0) => {
    setCurrentImageIndex(index);
    setImageModalOpen(true);
  };

  if (isLoading) {
    return (
      <View flex={1} justifyContent='center' alignItems='center' padding='$4'>
        <Spinner size='large' color='$blue10' />
        <Text marginTop='$4'>Loading product details...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View flex={1} justifyContent='center' alignItems='center' padding='$4'>
        <IoWarning size={40} color='#f44336' />
        <Text marginTop='$2' fontSize='$5' fontWeight='bold'>
          Product Not Found
        </Text>
        <Text marginTop='$2'>
          The product you're looking for doesn't exist or has been removed.
        </Text>
        <Button marginTop='$4' icon={IoArrowBack}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView padding='$4'>
      <XStack flexDirection={screen.xs ? 'column' : 'row'}>
        <View flexShrink={0} flexGrow={1}>
          <ProductstatusColor product={product} />
          <ProductImage {...{ product, handleImageClick, selectedVariant }} />
        </View>

        <YStack flex={1}>
          <Text numberOfLines={20} ellipsizeMode='tail' textAlign='left'>
            {startCase(product.name)}
          </Text>
          <H6 color='$gray10'>{startCase(product.category?.title)}</H6>

          <YStack marginTop='$3'>
            <Separator />

            <XStack justifyContent='space-between' alignItems='center'>
              {product.variants?.[selectedVariant].discount ? (
                <View>
                  <View
                    flex={1}
                    flexDirection='row'
                    spaceDirection='horizontal'
                    gap='$3'
                  >
                    <PriceFormatter
                      value={product.variants?.[selectedVariant].price}
                      crossed
                    />
                    {product.variants?.[selectedVariant].discount}% Off
                  </View>
                  <Text fontSize='$4' fontWeight='bold' color='$primary'>
                    <PriceFormatter
                      value={product.variants?.[selectedVariant]?.originalPrice}
                    />
                  </Text>
                </View>
              ) : (
                <Text fontSize='$4' fontWeight='bold' color='$primary'>
                  <PriceFormatter
                    value={product.variants?.[selectedVariant]?.originalPrice}
                  />
                </Text>
              )}

              <Text fontSize='$3' color='$gray10'>
                SKU: {product.variants?.[selectedVariant].sku}
              </Text>
            </XStack>
          </YStack>
          <ProductVariants
            {...{ selectedVariant, setSelectedVariant, product }}
          />
        </YStack>
      </XStack>
      <ProductInformation product={product} />
      {hasPermission(permissions.CAN_APPROVE_PRODUCT) && (
        <AdminActionButtons
          {...{
            product,
            imageModalOpen,
            setImageModalOpen,
            setCurrentImageIndex,
            currentImageIndex,
          }}
        />
      )}
    </ScrollView>
  );
};

export default ProductDetails;
