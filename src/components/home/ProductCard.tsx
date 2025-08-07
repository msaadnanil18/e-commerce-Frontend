'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
  Button,
  Card,
  XStack,
  YStack,
  Text,
  View,
  Spinner,
  styled,
} from 'tamagui';

import {
  FaHeart as Heart,
  FaShoppingCart as ShoppingCart,
  FaTag as Tag,
  FaRegHeart,
} from 'react-icons/fa';
import RenderDriveFile from '../appComponets/fileupload/RenderDriveFile';
import { IProduct } from '@/types/products';
import PriceFormatter from '../appComponets/PriceFormatter/PriceFormatter';

import { truncate } from 'lodash-es';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store/store';
import { ServiceErrorManager } from '@/helpers/service';
import { AddProductToCartService } from '@/services/cart';
import { useScreen } from '@/hook/useScreen';

const AnimatedCard = styled(Card, {
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',

  hoverStyle: {
    transform: 'translateY(-8px)',
    shadowColor: '$shadowColor',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },

  pressStyle: {
    transform: 'translateY(-4px)',
  },
});

const ImageContainer = styled(View, {
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '$4',
  backgroundColor: '$gray2',
});

const ActionButton = styled(Button, {
  position: 'absolute',
  width: 40,
  height: 40,
  borderRadius: 20,
  padding: 0,
  backgroundColor: '$background',
  borderWidth: 1,
  borderColor: '$borderColor',
  opacity: 0,
  transition: 'all 0.3s ease',

  variants: {
    visible: {
      true: {
        opacity: 1,
        transform: 'translateY(0)',
      },
      false: {
        opacity: 0,
        transform: 'translateY(10px)',
      },
    },
  },

  hoverStyle: {
    backgroundColor: '$primary',
    borderColor: '$primary',
    transform: 'scale(1.1)',
  },
});

const WishlistButton = styled(ActionButton, {
  top: 12,
  right: 12,
});

const DiscountBadge = styled(View, {
  position: 'absolute',
  top: 12,
  left: 12,
  backgroundColor: '$red9',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
  zIndex: 10,
});

const RatingContainer = styled(XStack, {
  alignItems: 'center',
  marginTop: 4,
  gap: 4,
});

const Name = React.memo<{
  product: IProduct;
  productOnClick: (r: IProduct) => void;
  isSmallScreen?: boolean;
}>(({ product, productOnClick, isSmallScreen }) => {
  const handleClick = useCallback(() => {
    productOnClick(product);
  }, [product, productOnClick]);

  return (
    <Text
      onPress={handleClick}
      fontSize={isSmallScreen ? '$3' : '$4'}
      fontWeight='500'
      color='$color'
      textAlign='center'
      numberOfLines={2}
      hoverStyle={{
        color: '$primary',
        cursor: 'pointer',
      }}
    >
      {truncate(product.name, { length: 25 })}
    </Text>
  );
});

interface IProductCardProps {
  product: IProduct;
  wishlistLoading: boolean;
  toggleWishlist: (r: string) => void;
  productOnClick: (r: IProduct) => void;
}

const ResponsiveProductCard: React.FC<
  IProductCardProps & { isCategoryLayout?: boolean }
> = ({
  product,
  toggleWishlist,
  wishlistLoading,
  productOnClick,
  isCategoryLayout,
}) => {
  const { width: screenWidth } = useScreen();
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user);

  const [cartSuccess, setCartSuccess] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeWishList, setActiveWishList] = useState<string>();

  const computedValues = useMemo(() => {
    const isInWishList = (product as any)?.isInWishList;
    const productInCart = (product as any).productInCart;
    const discount = product.variants?.[0]?.discount;
    const hasDiscount = discount && discount > 0;
    const quantity =
      product?.quantityRules?.step ||
      product?.quantityRules?.predefined?.[0] ||
      product?.quantityRules?.min ||
      1;

    return {
      isInWishList,
      productInCart,
      discount,
      hasDiscount,
      quantity,
    };
  }, [product]);

  const handleAddToCart = useCallback(
    async (product: IProduct) => {
      if (!user.isAuthenticated) {
        router.push(`/login?redirect=${pathname}`);
        return;
      }

      setCartSuccess(true);

      try {
        const [err] = await ServiceErrorManager(
          AddProductToCartService({
            data: {
              payload: {
                product: product?._id,
                variantId: product.variants[0]?._id,
                quantity: computedValues.quantity,
              },
            },
          }),
          { successMessage: 'Product added to cart' }
        );

        if (!err) {
          router.push('/cart');
        }
      } catch (error) {
        console.error('Failed to add product to cart:', error);
      } finally {
        setCartSuccess(false);
      }
    },
    [user.isAuthenticated, router, pathname, computedValues.quantity]
  );

  const handleWishlistToggle = useCallback(() => {
    toggleWishlist(product._id);
    setActiveWishList(product._id);
  }, [toggleWishlist, product._id]);

  const handleCartClick = useCallback(
    (e: any) => {
      e.preventDefault();
      e.stopPropagation();

      if (computedValues.productInCart) {
        router.push('/cart');
      } else {
        handleAddToCart(product);
      }
    },
    [computedValues.productInCart, router, handleAddToCart, product]
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const { isInWishList, productInCart, discount, hasDiscount } = computedValues;

  const cardWidth = useMemo(() => {
    if (screenWidth < 360) return 120;
    if (screenWidth < 400) return 120;
    if (screenWidth < 410) return 125;
    if (screenWidth < 420) return 140;
    // if (screenWidth < 430) return 140;
    // if (screenWidth < 440) return 132;

    // if (screenWidth < 450) return 134;
    // if (screenWidth < 460) return 136;
    // if (screenWidth < 470) return 138;
    // if (screenWidth < 480) return 140;

    return 140;
  }, [screenWidth]);

  return (
    <AnimatedCard
      bordered
      padding='$2'
      margin='$2'
      width={isCategoryLayout ? cardWidth : 120}
      height={isCategoryLayout ? 184 : 180}
      backgroundColor='$background'
      borderColor='$borderColor'
      borderRadius='$4'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ImageContainer>
        {hasDiscount && (
          <DiscountBadge top={3} left={3} paddingHorizontal={3}>
            <XStack alignItems='center' gap={2}>
              <Tag size={8} color='white' />
              <Text fontSize='$2' color='white' fontWeight='bold'>
                {discount}% OFF
              </Text>
            </XStack>
          </DiscountBadge>
        )}

        <WishlistButton
          width={30}
          height={30}
          top={5}
          right={5}
          visible={isHovered || true}
          onPress={handleWishlistToggle}
          borderColor={isInWishList ? '$red9' : '$borderColor'}
          aria-label={isInWishList ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlistLoading && activeWishList === product._id ? (
            <Spinner size='small' />
          ) : isInWishList ? (
            <Heart size={15} color='red' cursor='pointer' />
          ) : (
            <FaRegHeart size={15} cursor='pointer' />
          )}
        </WishlistButton>

        <RenderDriveFile
          onClick={() => productOnClick(product)}
          file={product.thumbnail}
          style={{
            width: '100%',
            height: 80,
            borderRadius: 8,
            objectFit: 'cover',
          }}
        />
      </ImageContainer>

      <YStack flex={1} paddingTop='$1' gap='$1'>
        <Name
          product={product}
          productOnClick={productOnClick}
          isSmallScreen={true}
        />

        <YStack gap='$1'>
          {hasDiscount ? (
            <XStack
              alignItems='center'
              flex={1}
              flexDirection='column'
              gap='$-0.25'
            >
              <Text fontSize='$3' fontWeight='bold' color='$primary'>
                <PriceFormatter value={product?.variants?.[0]?.originalPrice} />
              </Text>
              <Text fontSize='$3' color='$gray10'>
                <PriceFormatter crossed value={product?.variants?.[0]?.price} />
              </Text>
            </XStack>
          ) : (
            <Text fontSize='$5' fontWeight='bold' color='$primary'>
              <PriceFormatter value={product?.variants?.[0]?.originalPrice} />
            </Text>
          )}
        </YStack>

        <Button
          size='$1.5'
          backgroundColor={productInCart ? '$green9' : '$primary'}
          color='white'
          fontSize='$2'
          fontWeight='600'
          padding='$1'
          marginTop='$1'
          borderRadius='$2'
          icon={
            cartSuccess ? (
              <Spinner color='white' size='small' />
            ) : (
              <ShoppingCart size={12} color='white' />
            )
          }
          disabled={cartSuccess}
          onPress={handleCartClick}
          aria-label={productInCart ? 'View cart' : 'Add to cart'}
          hoverStyle={{
            backgroundColor: productInCart ? '$green10' : '$primaryHover',
            transform: 'translateY(-2px)',
          }}
          pressStyle={{
            transform: 'translateY(0)',
          }}
        >
          {productInCart ? 'IN CART' : 'ADD TO CART'}
        </Button>
      </YStack>
    </AnimatedCard>
  );
};

const DefaultProductCard: React.FC<IProductCardProps> = ({
  product,
  toggleWishlist,
  wishlistLoading,
  productOnClick,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async (product: IProduct) => {
    const quantity =
      product?.quantityRules?.step ||
      product?.quantityRules?.predefined?.[0] ||
      product?.quantityRules?.min ||
      1;

    if (!user.isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }

    setCartSuccess(true);
    const [err] = await ServiceErrorManager(
      AddProductToCartService({
        data: {
          payload: {
            product: product?._id,
            variantId: product.variants[0]?._id,
            quantity: quantity,
          },
        },
      }),
      { successMessage: 'Product added to cart' }
    );

    setCartSuccess(false);
    if (!err) {
      router.push('/cart');
    }
  };

  const isInWishList = (product as any)?.isInWishList;
  const productInCart = (product as any).productInCart;
  const discount = product.variants?.[0]?.discount;
  const hasDiscount = discount && discount > 0;

  return (
    <AnimatedCard
      bordered
      padding='$4'
      margin='$2'
      width={240}
      height={360}
      backgroundColor='$background'
      borderColor='$borderColor'
      borderRadius='$6'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ImageContainer>
        {hasDiscount && (
          <DiscountBadge>
            <XStack alignItems='center' gap={2}>
              <Tag size={12} color='white' />
              <Text fontSize='$3' color='white' fontWeight='bold'>
                {discount}% OFF
              </Text>
            </XStack>
          </DiscountBadge>
        )}

        <WishlistButton
          visible={isHovered}
          onPress={() => {
            toggleWishlist(product._id);
          }}
          // backgroundColor={isInWishList ? '$red9' : '$background'}
          borderColor={isInWishList ? '$red9' : '$borderColor'}
        >
          {wishlistLoading ? (
            <Spinner size='small' />
          ) : isInWishList ? (
            <Heart size={20} color='red' cursor='pointer' />
          ) : (
            <FaRegHeart size={20} cursor='pointer' />
          )}
        </WishlistButton>

        <RenderDriveFile
          onClick={() => {
            productOnClick(product);
          }}
          file={product.thumbnail}
          style={{
            width: '100%',
            height: 180,
            borderRadius: 12,
            objectFit: 'cover',
          }}
        />
      </ImageContainer>

      <YStack flex={1} paddingTop='$3' gap='$2'>
        <Name product={product} productOnClick={productOnClick} />

        {/* <RatingContainer>
          <XStack>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                color={i < 4 ? '#ffd700' : '#ddd'}
                fill={i < 4 ? '#ffd700' : 'none'}
              />
            ))}
          </XStack>
          <Text fontSize='$2' color='$gray10'>
            (4.0)
          </Text>
        </RatingContainer> */}

        <YStack gap='$1'>
          {hasDiscount ? (
            <XStack alignItems='center' gap='$2'>
              <Text fontSize='$5' fontWeight='bold' color='$primary'>
                <PriceFormatter value={product?.variants?.[0]?.originalPrice} />
              </Text>
              <Text fontSize='$3' color='$gray10'>
                <PriceFormatter crossed value={product?.variants?.[0]?.price} />
              </Text>
            </XStack>
          ) : (
            <Text fontSize='$5' fontWeight='bold' color='$primary'>
              <PriceFormatter value={product?.variants?.[0]?.originalPrice} />
            </Text>
          )}
        </YStack>

        {productInCart ? (
          <Button
            size='$3'
            backgroundColor={productInCart ? '$green9' : '$primary'}
            color='white'
            fontSize='$3'
            fontWeight='600'
            marginTop='$2'
            borderRadius='$4'
            onPress={() => {
              router.push('/cart');
            }}
            icon={<ShoppingCart size={16} color='white' />}
            disabled={cartSuccess}
            hoverStyle={{
              backgroundColor: productInCart ? '$green10' : '$primaryHover',
              transform: 'translateY(-2px)',
            }}
            pressStyle={{
              transform: 'translateY(0)',
            }}
          >
            IN CART
          </Button>
        ) : (
          <Button
            size='$3'
            backgroundColor={productInCart ? '$green9' : '$primary'}
            color='white'
            fontSize='$3'
            fontWeight='600'
            marginTop='$2'
            borderRadius='$4'
            icon={
              cartSuccess ? (
                <Spinner color='white' size='small' />
              ) : (
                <ShoppingCart size={16} color='white' />
              )
            }
            disabled={cartSuccess}
            onPress={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart(product);
            }}
            hoverStyle={{
              backgroundColor: productInCart ? '$green10' : '$primaryHover',
              transform: 'translateY(-2px)',
            }}
            pressStyle={{
              transform: 'translateY(0)',
            }}
          >
            {productInCart ? 'IN CART' : 'ADD TO CART'}
          </Button>
        )}
      </YStack>
    </AnimatedCard>
  );
};

const ProductCard: React.FC<
  IProductCardProps & { isResponsive?: boolean; isCategoryLayout?: boolean }
> = (props) => {
  return props.isResponsive ? (
    <ResponsiveProductCard {...props} />
  ) : (
    <DefaultProductCard {...props} />
  );
};

export default ProductCard;
