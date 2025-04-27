'use client';
import React, { FC } from 'react';
import { YStack, XStack, Card, Text, Separator, Button } from 'tamagui';
import PriceFormatter from '../appComponets/PriceFormatter/PriceFormatter';
import { ICart } from '@/types/cart';
import { useRouter } from 'next/navigation';

const OrderSummary: FC<{
  cartDetail: ICart | null;
  isVisiableButButton?: boolean;
  extraCharges?: object | null;
}> = ({ cartDetail, isVisiableButButton = true, extraCharges }) => {
  const router = useRouter();
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
    <YStack width='30%' padding='$4'>
      <Card bordered padding='$4' backgroundColor='$cardBackground'>
        <Text fontSize='$5' fontWeight='700' marginBottom='$3'>
          Order Summary
        </Text>

        <XStack justifyContent='space-between' marginBottom='$2'>
          <Text fontSize='$4'>Subtotal</Text>
          <Text fontSize='$4'>
            <PriceFormatter value={subtotal} />
          </Text>
        </XStack>

        <XStack justifyContent='space-between' marginBottom='$2'>
          <Text fontSize='$4' color='$green10'>
            Discount
          </Text>
          <Text fontSize='$4' color='$green10'>
            -<PriceFormatter value={totalDiscount} />
          </Text>
        </XStack>

        <XStack justifyContent='space-between' marginBottom='$2'>
          <Text fontSize='$4' color='$$yellow10'>
            Delivery Charge
          </Text>
          <Text fontSize='$4' color='$yellow10'>
            +
            <PriceFormatter
              value={(extraCharges as any)?.total?.delivery || 0}
            />
          </Text>
        </XStack>

        <XStack justifyContent='space-between' marginBottom='$2'>
          <Text fontSize='$4' color='$$yellow10'>
            Service Charge
          </Text>
          <Text fontSize='$4' color='$yellow10'>
            +
            <PriceFormatter
              value={(extraCharges as any)?.total?.service || 0}
            />
          </Text>
        </XStack>

        <XStack justifyContent='space-between' marginBottom='$2'>
          <Text fontSize='$4'>Tax (0%)</Text>
          <Text fontSize='$4'>
            <PriceFormatter value={tax} />
          </Text>
        </XStack>

        <Separator marginVertical='$2' />

        <XStack justifyContent='space-between' marginBottom='$3'>
          <Text fontSize='$5' fontWeight='700'>
            Total
          </Text>
          <Text fontSize='$5' fontWeight='700'>
            <PriceFormatter value={totalPrice ?? 0} />
          </Text>
        </XStack>
        {isVisiableButButton && (
          <Button
            backgroundColor='$primary'
            color='$text'
            marginTop='$4'
            size='$3'
            fontSize='$4'
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
