'use client';
import { FC, useState, Dispatch, SetStateAction } from 'react';
import { XStack, YStack, Text, Button, Input, View } from 'tamagui';
import { IProduct } from '@/types/products';
import ProductImage from '../admin/management/productdetails/ProductImage';
import { ServiceErrorManager } from '@/helpers/service';
import { AddProductToCartService } from '@/services/cart';
import { FaHeart, FaRegHeart, FaSpinner } from 'react-icons/fa';
import { AddProductToWishlistService } from '@/services/wishList';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store/store';
import { useRouter, usePathname } from 'next/navigation';

interface ProductImageSectionProps {
  product: IProduct;
  setProduct: Dispatch<SetStateAction<IProduct | null>>;
  selectedVariant: number;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  isMobile: boolean;
}

const ProductImageSection: FC<ProductImageSectionProps> = ({
  product,
  setProduct,
  selectedVariant,
  quantity,
  setQuantity,
  isMobile,
}) => {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const [cartSuccess, setCartSuccess] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [addWishListLoading, setAddWishListLoading] = useState<boolean>(false);

  const variants = product.variants || [];
  const currentVariant = variants[selectedVariant] || {};

  const handleImageClick = (index: number = 0) => {
    setShowImageModal(true);
  };

  const handleBuyNow = () => {
    console.log('Buy now clicked');
  };

  const handleAddToCart = async () => {
    if (!user.isAuthenticated) {
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
      { successMessage: 'Product added to cart' }
    );

    setCartSuccess(false);
  };

  const addProductToWishlist = async () => {
    if (!user.isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }
    setAddWishListLoading(true);
    const [_, { data }] = await ServiceErrorManager(
      AddProductToWishlistService({
        data: {
          payload: {
            product: product._id,
          },
        },
      }),
      {}
    );
    setProduct((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        isInWishList: data.products?.includes(prev._id),
      };
    });

    setAddWishListLoading(false);
  };

  return (
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
              disabled={(() => {
                const predefined = product.quantityRules?.predefined;
                if (predefined?.length) {
                  return quantity === predefined[0];
                }
                const step = product.quantityRules?.step || 1;
                const min = product.quantityRules?.min || 1;
                return quantity - step < min;
              })()}
              onPress={() => {
                const predefined = product.quantityRules?.predefined;
                if (predefined?.length) {
                  const currentIndex = predefined.indexOf(quantity);
                  if (currentIndex > 0) {
                    setQuantity(predefined[currentIndex - 1]);
                  }
                } else {
                  const step = product.quantityRules?.step || 1;
                  const min = product.quantityRules?.min || 1;
                  setQuantity((q) => Math.max(q - step, min));
                }
              }}
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
                  const predefined = product.quantityRules?.predefined;
                  const min = product.quantityRules?.min || 1;
                  const max = product.quantityRules?.max || 999;
                  if (predefined?.length) {
                    const closest = predefined.reduce((prev, curr) =>
                      Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
                    );
                    setQuantity(closest);
                  } else {
                    setQuantity(Math.min(Math.max(val, min), max));
                  }
                }
              }}
            />

            <Button
              size={isMobile ? '$2' : '$3'}
              disabled={(() => {
                const predefined = product.quantityRules?.predefined;
                if (predefined?.length) {
                  return quantity === predefined[predefined.length - 1];
                }
                const step = product.quantityRules?.step || 1;
                const max = product.quantityRules?.max || 999;
                return quantity + step > max;
              })()}
              onPress={() => {
                const predefined = product.quantityRules?.predefined;
                if (predefined?.length) {
                  const currentIndex = predefined.indexOf(quantity);
                  if (currentIndex < predefined.length - 1) {
                    setQuantity(predefined[currentIndex + 1]);
                  }
                } else {
                  const step = product.quantityRules?.step || 1;
                  const max = product.quantityRules?.max || 999;
                  setQuantity((q) => Math.min(q + step, max));
                }
              }}
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

      <XStack space='$2' marginTop='$2' marginBottom={isMobile ? '$4' : '$0'}>
        <Button
          size={isMobile ? '$3' : '$4'}
          backgroundColor='$primary'
          flex={1}
          onPress={handleAddToCart}
          disabled={
            currentVariant.inventory === 0 && !currentVariant.isMadeOnDemand
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
            currentVariant.inventory === 0 && !currentVariant.isMadeOnDemand
          }
        >
          Buy Now
        </Button>
      </XStack>
    </YStack>
  );
};

export default ProductImageSection;
