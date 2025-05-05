'use client';
import { FC, useState, Dispatch, SetStateAction } from 'react';
import {
  XStack,
  YStack,
  Text,
  Button,
  Separator,
  View,
  Spinner,
  Input,
  Card,
  ScrollView,
  Theme,
} from 'tamagui';
import Navbar from '../navbar';
import { IProduct } from '@/types/products';
import ProductImage from '../admin/management/productdetails/ProductImage';
import ProductSpecification from './ProductSpecification';
import CustomerReviews from './ CustomerReviews';
import { ServiceErrorManager } from '@/helpers/service';
import { AddProductToCartService } from '@/services/cart';
import PriceFormatter from '../appComponets/PriceFormatter/PriceFormatter';
import { FaHeart, FaRegHeart, FaSpinner } from 'react-icons/fa';
import { AddProductToWishlistService } from '@/services/wishList';
import { useScreen } from '@/hook/useScreen';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store/store';
import { useRouter, usePathname } from 'next/navigation';

const ItemDetails: FC<{
  product: IProduct | null;
  isLoading: boolean;
  setProduct: Dispatch<SetStateAction<IProduct | null>>;
}> = (props) => {
  const {
    user: { isAuthenticated },
  } = useSelector((state: RootState) => state);
  const router = useRouter();
  const pathname = usePathname();
  const screen = useScreen();
  const { isLoading, product } = props;
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(product?.quantityRules?.min || 1);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [addWishListLoading, setAddWishListLoading] = useState<boolean>(false);

  const handleImageClick = (index: number = 0) => {
    setShowImageModal(true);
  };

  const handleBuyNow = () => {
    console.log('Buy now clicked');
  };

  if (isLoading)
    return (
      <XStack justifyContent='center' alignItems='center' height='100vh'>
        <Spinner size='large' />
        <Text marginLeft='$2'>Loading product details...</Text>
      </XStack>
    );

  if (!product) return <Text>Product not found</Text>;

  const variants = product.variants || [];
  const currentVariant = variants[selectedVariant] || {};

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }
    setCartSuccess(true);
    await ServiceErrorManager(
      AddProductToCartService({
        data: {
          payload: {
            product: product?._id,
            variantId: variants[selectedVariant]?._id,
            quantity: quantity,
          },
        },
      }),
      {}
    );

    setCartSuccess(false);
  };

  const addProductToWishlist = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }
    setAddWishListLoading(true);
    const [_, data] = await ServiceErrorManager(
      AddProductToWishlistService({
        data: {
          payload: {
            product: product._id,
          },
        },
      }),
      {}
    );
    props.setProduct((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        isInWishList: data.products?.includes(prev._id),
      };
    });

    setAddWishListLoading(false);
  };

  const isMobile = screen.xs;

  return (
    <Theme name='light'>
      <YStack flex={1}>
        <Navbar />
        <ScrollView padding={isMobile ? '$3' : '$4'}>
          <XStack
            flexDirection={isMobile ? 'column' : 'row'}
            gap={isMobile ? '$4' : '$6'}
          >
            <YStack space='$3' flex={1} width={isMobile ? '100%' : '45%'}>
              <XStack justifyContent='flex-end' padding='$1'>
                {addWishListLoading ? (
                  <FaSpinner className='animate-spin' />
                ) : (product as any)?.isInWishList ? (
                  <FaHeart
                    size={20}
                    color='red'
                    onClick={addProductToWishlist}
                    cursor='pointer'
                  />
                ) : (
                  <FaRegHeart
                    size={20}
                    onClick={addProductToWishlist}
                    cursor='pointer'
                  />
                )}
              </XStack>

              <ProductImage
                product={product}
                handleImageClick={handleImageClick}
                selectedVariant={selectedVariant}
              />

              <YStack space='$2' marginTop='$2'>
                <Text fontSize={isMobile ? '$3' : '$4'} fontWeight='bold'>
                  Quantity
                </Text>
                <XStack
                  space='$2'
                  alignItems='center'
                  flexWrap={isMobile ? 'wrap' : 'nowrap'}
                >
                  <XStack alignItems='center' space='$1'>
                    <Button
                      size={isMobile ? '$2' : '$3'}
                      disabled={quantity <= (product.quantityRules?.min || 1)}
                      onPress={() =>
                        setQuantity((q) =>
                          Math.max(
                            q - (product.quantityRules?.step || 1),
                            product.quantityRules?.min || 1
                          )
                        )
                      }
                    >
                      -
                    </Button>
                    <Input
                      value={quantity.toString()}
                      textAlign='center'
                      width={isMobile ? 50 : 80}
                      size={isMobile ? '$2' : '$3'}
                      onChange={(e) => {
                        const val = parseInt(e.nativeEvent.text);
                        if (!isNaN(val)) {
                          const min = product.quantityRules?.min || 1;
                          const max = product.quantityRules?.max || 999;
                          setQuantity(Math.min(Math.max(val, min), max));
                        }
                      }}
                    />
                    <Button
                      size={isMobile ? '$2' : '$3'}
                      disabled={quantity >= (product.quantityRules?.max || 999)}
                      onPress={() =>
                        setQuantity((q) =>
                          Math.min(
                            q + (product.quantityRules?.step || 1),
                            product.quantityRules?.max || 999
                          )
                        )
                      }
                    >
                      +
                    </Button>
                  </XStack>

                  {product.quantityRules?.predefined &&
                    product.quantityRules.predefined.length > 0 && (
                      <XStack
                        marginLeft={isMobile ? '$0' : '$4'}
                        marginTop={isMobile ? '$2' : '$0'}
                        flexWrap='wrap'
                        gap='$1'
                      >
                        {product.quantityRules.predefined.map((q, idx) => (
                          <Button
                            key={idx}
                            size='$2'
                            variant='outlined'
                            onPress={() => setQuantity(q)}
                          >
                            {q}
                          </Button>
                        ))}
                      </XStack>
                    )}
                </XStack>
              </YStack>

              <YStack
                space='$2'
                backgroundColor='$gray2'
                padding='$3'
                borderRadius='$2'
                marginTop='$2'
              >
                <XStack alignItems='center' space='$2'>
                  <Text fontSize={isMobile ? '$3' : '$4'} fontWeight='bold'>
                    Delivery:
                  </Text>
                  <Text fontSize={isMobile ? '$2' : '$3'}>
                    {currentVariant.isMadeOnDemand
                      ? `Made on demand (${
                          currentVariant.shippingTimeline || 'Timeframe varies'
                        })`
                      : currentVariant.inventory > 0
                      ? 'In stock, ready to ship'
                      : 'Out of stock'}
                  </Text>
                </XStack>

                <XStack alignItems='center' space='$2'>
                  <Text fontSize={isMobile ? '$3' : '$4'} fontWeight='bold'>
                    Seller:
                  </Text>
                  <Text fontSize={isMobile ? '$2' : '$3'}>
                    {product.sellerSpecificDetails?.brand || 'Brand'}
                  </Text>
                </XStack>
              </YStack>

              <XStack
                space='$2'
                marginTop='$2'
                marginBottom={isMobile ? '$4' : '$0'}
              >
                <Button
                  size={isMobile ? '$3' : '$4'}
                  backgroundColor='$primary'
                  flex={1}
                  onPress={handleAddToCart}
                  disabled={
                    currentVariant.inventory === 0 &&
                    !currentVariant.isMadeOnDemand
                  }
                >
                  {cartSuccess ? '✓ Added to Cart' : 'Add to Cart'}
                </Button>
                <Button
                  size={isMobile ? '$3' : '$4'}
                  backgroundColor='$green9'
                  flex={1}
                  onPress={handleBuyNow}
                  disabled={
                    currentVariant.inventory === 0 &&
                    !currentVariant.isMadeOnDemand
                  }
                >
                  Buy Now
                </Button>
              </XStack>
            </YStack>

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

                <Text
                  fontSize='$2'
                  color='$gray10'
                  marginTop={isMobile ? '$2' : '$0'}
                >
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
                        variant={
                          selectedVariant === idx ? 'outlined' : undefined
                        }
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
                    <Text color='$primary' fontWeight='bold' fontSize='$2'>
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
                          <Text fontSize='$2' color='$gray10'>
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
                      <Text fontSize='$2' color='$gray10'>
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
                        <Text fontSize='$2' color='$gray10'>
                          Production Time
                        </Text>
                        <Text>
                          {variants[selectedVariant]?.shippingTimeline || 'N/A'}{' '}
                          days
                        </Text>
                      </YStack>
                    )}
                  </XStack>
                </YStack>
              </Card>
            </YStack>
          </XStack>

          <YStack space='$6' marginTop='$6'>
            <ProductSpecification product={product} />
            <CustomerReviews product={product} />
          </YStack>
        </ScrollView>
      </YStack>
    </Theme>
  );
};

export default ItemDetails;
