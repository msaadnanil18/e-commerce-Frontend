'use client';
import { FC, useState, useEffect, Dispatch, SetStateAction } from 'react';
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

const ItemDetails: FC<{
  product: IProduct | null;
  isLoading: boolean;
  setProduct: Dispatch<SetStateAction<IProduct | null>>;
}> = (props) => {
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

  return (
    <YStack>
      <Navbar />

      <XStack space='$2' className='max-w-6xl' padding='$4'>
        <YStack space='$2' className='w-full md:w-1/2'>
          <YStack>
            {addWishListLoading ? (
              <FaSpinner className='animate-spin' />
            ) : (product as any)?.isInWishList ? (
              <FaHeart
                size={16}
                color='red'
                onClick={addProductToWishlist}
                cursor='pointer'
              />
            ) : (
              <FaRegHeart
                size={16}
                onClick={addProductToWishlist}
                cursor='pointer'
              />
            )}

            <ProductImage
              product={product}
              handleImageClick={handleImageClick}
              selectedVariant={selectedVariant}
            />
          </YStack>
          <YStack space='$2'>
            <Text fontSize='$4' fontWeight='bold'>
              Quantity
            </Text>
            <XStack space='$2' alignItems='center'>
              <Button
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
                width={80}
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

              {product.quantityRules?.predefined &&
                product.quantityRules.predefined.length > 0 && (
                  <XStack marginLeft='$4' flexWrap='wrap'>
                    {product.quantityRules.predefined.map((q, idx) => (
                      <Button
                        key={idx}
                        size='$2'
                        variant='outlined'
                        marginLeft='$1'
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
          >
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

            <XStack alignItems='center' space='$2'>
              <Text fontSize='$4' fontWeight='bold'>
                Seller:
              </Text>
              <Text>{product.sellerSpecificDetails?.brand || 'Brand'}</Text>
            </XStack>
          </YStack>

          <XStack space='$4' marginLeft='$4'>
            <Button
              size='$4'
              backgroundColor='$primary'
              flexGrow={1}
              onPress={handleAddToCart}
              disabled={
                currentVariant.inventory === 0 && !currentVariant.isMadeOnDemand
              }
            >
              {cartSuccess ? '✓ Added to Cart' : 'Add to Cart'}
            </Button>
            <Button
              size='$4'
              backgroundColor='$green9'
              flexGrow={1}
              onPress={handleBuyNow}
              disabled={
                currentVariant.inventory === 0 && !currentVariant.isMadeOnDemand
              }
            >
              Buy Now
            </Button>
          </XStack>
        </YStack>

        <YStack space='$4' className='w-full md:w-1/2 pl-0 md:pl-8'>
          <Text fontSize='$4' fontWeight='bold'>
            {product.name}
          </Text>

          <Separator />

          <XStack justifyContent='space-between' alignItems='center'>
            {currentVariant.discount ? (
              <View>
                <View
                  flex={1}
                  flexDirection='row'
                  spaceDirection='horizontal'
                  gap='$3'
                >
                  <PriceFormatter value={currentVariant.price} crossed />
                  {currentVariant.discount}% off
                </View>
                <Text fontSize='$4' fontWeight='bold' color='$primary'>
                  <PriceFormatter value={currentVariant?.originalPrice} />
                </Text>
              </View>
            ) : (
              <Text fontSize='$4' fontWeight='bold' color='$primary'>
                <PriceFormatter value={currentVariant?.originalPrice} />
              </Text>
            )}

            <Text fontSize='$3' color='$gray10'>
              SKU: {currentVariant.sku}
            </Text>
          </XStack>

          <Text fontSize='$3' color='$gray11'>
            {product.description}
          </Text>

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
                    {/* {Object.entries(variant.attributes || {})
                      .map(([key, value]) => `${value}`)
                      .join(' / ')} */}
                  </Button>
                ))}
              </XStack>
            </YStack>
          )}

          <Card
            padding='$3'
            borderRadius='$2'
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

      <ProductSpecification product={product} />
      <CustomerReviews product={product} />
    </YStack>
  );
};

export default ItemDetails;
