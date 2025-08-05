'use client';

import React, { useState, useCallback, useMemo } from 'react';
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

const WishlistButton = styled(ActionButton);

const DiscountBadge = styled(View, {
  position: 'absolute',
  backgroundColor: '$red9',
  borderRadius: 12,
  zIndex: 10,
});

// Memoized Name component to prevent unnecessary re-renders
const Name = React.memo<{
  product: IProduct;
  productOnClick: (r: IProduct) => void;
  isSmallScreen: boolean;
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

Name.displayName = 'ProductName';

interface ProductCardProps {
  product: IProduct;
  wishlistLoading: boolean;
  toggleWishlist: (id: string) => void;
  productOnClick: (product: IProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  toggleWishlist,
  wishlistLoading,
  productOnClick,
}) => {
  const screen = useScreen();
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user);

  const [cartSuccess, setCartSuccess] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeWishList, setActiveWishList] = useState<string>();

  // Memoize computed values to prevent unnecessary recalculations
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
      isSmallScreen: screen.xs,
    };
  }, [product, screen.xs]);

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

  const { isInWishList, productInCart, discount, hasDiscount, isSmallScreen } =
    computedValues;

  const cardDimensions = {
    width: isSmallScreen ? 120 : 240,
    height: isSmallScreen ? 180 : 360,
    padding: isSmallScreen ? '$2' : '$4',
  };

  const buttonSize = isSmallScreen ? 30 : 40;
  const iconSize = isSmallScreen ? 15 : 20;

  return (
    <AnimatedCard
      bordered
      padding={cardDimensions.padding}
      margin='$2'
      width={cardDimensions.width}
      height={cardDimensions.height}
      backgroundColor='$background'
      borderColor='$borderColor'
      borderRadius='$6'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ImageContainer>
        {hasDiscount && (
          <DiscountBadge
            top={isSmallScreen ? 3 : 12}
            left={isSmallScreen ? 3 : 12}
            paddingHorizontal={isSmallScreen ? 3 : 8}
          >
            <XStack alignItems='center' gap={2}>
              <Tag size={isSmallScreen ? 8 : 12} color='white' />
              <Text
                fontSize={isSmallScreen ? '$2' : '$3'}
                color='white'
                fontWeight='bold'
              >
                {discount}% OFF
              </Text>
            </XStack>
          </DiscountBadge>
        )}

        <WishlistButton
          width={buttonSize}
          height={buttonSize}
          top={isSmallScreen ? 5 : 12}
          right={isSmallScreen ? 5 : 12}
          visible={isHovered || isSmallScreen}
          onPress={handleWishlistToggle}
          borderColor={isInWishList ? '$red9' : '$borderColor'}
          aria-label={isInWishList ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlistLoading && activeWishList === product._id ? (
            <Spinner size='small' />
          ) : isInWishList ? (
            <Heart size={iconSize} color='red' cursor='pointer' />
          ) : (
            <FaRegHeart size={iconSize} cursor='pointer' />
          )}
        </WishlistButton>

        <RenderDriveFile
          onClick={() => productOnClick(product)}
          file={product.thumbnail}
          style={{
            width: '100%',
            height: isSmallScreen ? 80 : 180,
            borderRadius: 12,
            objectFit: 'cover',
          }}
        />
      </ImageContainer>

      <YStack
        flex={1}
        paddingTop={isSmallScreen ? '$1' : '$3'}
        gap={isSmallScreen ? '$1' : '$2'}
      >
        <Name
          product={product}
          productOnClick={productOnClick}
          isSmallScreen={isSmallScreen}
        />

        <YStack gap='$1'>
          {hasDiscount ? (
            <XStack
              alignItems='center'
              flex={1}
              flexDirection={isSmallScreen ? 'column' : 'row'}
              gap={isSmallScreen ? '$-0.25' : '$2'}
            >
              <Text
                fontSize={isSmallScreen ? '$3' : '$5'}
                fontWeight='bold'
                color='$primary'
              >
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
          size={isSmallScreen ? '$1.5' : '$3'}
          backgroundColor={productInCart ? '$green9' : '$primary'}
          color='white'
          fontSize={isSmallScreen ? '$2' : '$3'}
          fontWeight='600'
          padding={isSmallScreen ? '$1' : 'auto'}
          marginTop={isSmallScreen ? '$1' : '$2'}
          borderRadius={isSmallScreen ? '$2' : '$4'}
          icon={
            cartSuccess ? (
              <Spinner color='white' size='small' />
            ) : (
              <ShoppingCart size={isSmallScreen ? 12 : 16} color='white' />
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

export default React.memo(ProductCard);
