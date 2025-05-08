'use client';
import React, { FC } from 'react';
import { YStack, XStack, Card, Text, Separator, Button } from 'tamagui';
import PriceFormatter from '../appComponets/PriceFormatter/PriceFormatter';
import { ICart } from '@/types/cart';
import { useRouter } from 'next/navigation';
import { useScreen } from '@/hook/useScreen';

const OrderSummary: FC<{
  cartDetail: ICart | null;
  isVisiableButButton?: boolean;
  extraCharges?: object | null;
}> = ({ cartDetail, isVisiableButButton = true, extraCharges }) => {
  const router = useRouter();
  const media = useScreen();

  const subtotal = (cartDetail?.items || []).reduce(
    (sum, item) =>
      sum +
      (item.product.variants.find((variant) => variant._id === item.variant)
        ?.price || 0) *
        item.quantity,
    0
  );

  const totalDiscount = (cartDetail?.items || []).reduce((sum, item) => {
    const variant = item.product.variants.find(
      (v) => v._id.toString() === item.variant.toString()
    );
    return sum + (variant?.discount || 0) * item.quantity;
  }, 0);

  const tax = (subtotal - totalDiscount) * 0;

  const totalPrice =
    cartDetail?.totalPrice +
    ((extraCharges as any)?.total?.delivery || 0) +
    ((extraCharges as any)?.total?.service || 0);

  return (
    <YStack
      width={media.lg ? '30%' : media.sm ? '40%' : '100%'}
      padding={media.sm ? '$2' : '$4'}
    >
      <Card
        bordered
        padding={media.sm ? '$3' : '$4'}
        backgroundColor='$cardBackground'
      >
        <Text
          fontSize={media.sm ? '$4' : '$5'}
          fontWeight='700'
          marginBottom='$3'
        >
          Order Summary
        </Text>

        <XStack justifyContent='space-between' marginBottom='$2'>
          <Text fontSize={media.sm ? '$3' : '$4'}>Subtotal</Text>
          <Text fontSize={media.sm ? '$3' : '$4'}>
            <PriceFormatter value={subtotal} />
          </Text>
        </XStack>

        <XStack justifyContent='space-between' marginBottom='$2'>
          <Text fontSize={media.sm ? '$3' : '$4'} color='$green10'>
            Discount
          </Text>
          <Text fontSize={media.sm ? '$3' : '$4'} color='$green10'>
            -<PriceFormatter value={totalDiscount} />
          </Text>
        </XStack>

        <XStack justifyContent='space-between' marginBottom='$2'>
          <Text fontSize={media.sm ? '$3' : '$4'} color='$yellow10'>
            Delivery Charge
          </Text>
          <Text fontSize={media.sm ? '$3' : '$4'} color='$yellow10'>
            +
            <PriceFormatter
              value={(extraCharges as any)?.total?.delivery || 0}
            />
          </Text>
        </XStack>

        <XStack justifyContent='space-between' marginBottom='$2'>
          <Text fontSize={media.sm ? '$3' : '$4'} color='$yellow10'>
            Service Charge
          </Text>
          <Text fontSize={media.sm ? '$3' : '$4'} color='$yellow10'>
            +
            <PriceFormatter
              value={(extraCharges as any)?.total?.service || 0}
            />
          </Text>
        </XStack>

        <XStack justifyContent='space-between' marginBottom='$2'>
          <Text fontSize={media.sm ? '$3' : '$4'}>Tax (0%)</Text>
          <Text fontSize={media.sm ? '$3' : '$4'}>
            <PriceFormatter value={tax} />
          </Text>
        </XStack>

        <Separator marginVertical='$2' />

        <XStack justifyContent='space-between' marginBottom='$3'>
          <Text fontSize={media.sm ? '$4' : '$5'} fontWeight='700'>
            Total
          </Text>
          <Text fontSize={media.sm ? '$4' : '$5'} fontWeight='700'>
            <PriceFormatter value={totalPrice ?? 0} />
          </Text>
        </XStack>

        {isVisiableButButton && (
          <Button
            backgroundColor='$primary'
            color='$text'
            marginTop='$4'
            size={media.sm ? '$2' : '$3'}
            fontSize={media.sm ? '$3' : '$4'}
            hoverStyle={{ scale: 1.05 }}
            onPress={() => router.push('/checkout')}
          >
            Proceed to Buy
          </Button>
        )}
      </Card>
    </YStack>
  );
};

export default OrderSummary;
