'use client';
import React, { FC, Fragment, useEffect, useState, use } from 'react';
import { XStack, YStack, ScrollView, Card, Spinner } from 'tamagui';
import { ServiceErrorManager } from '@/helpers/service';
import {
  CalculateProductExtraChargesService,
  GetCartDetailsService,
  GetCartPageDetailsService,
} from '@/services/cart';
import { ICart } from '@/types/cart';
import AddressList from '@/components/checkout/AddressList';
import OrderSummary from '@/components/cart/OrderSummary';
import PaymentDetails from '@/components/checkout/PaymentDetails';
import { useSearchParams } from 'next/navigation';

const Checkout: FC = () => {
  const searchParams = useSearchParams();
  const deliveryAddress = searchParams.get('delivery-address');

  const [cartDetail, setCartDetail] = useState<ICart | null>(null);
  const [extraCharges, setExtraCharges] = useState<object | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchCartDetails = () => {
    setLoading(true);
    ServiceErrorManager(GetCartPageDetailsService(), {})
      .then(([_, response]) => {
        setExtraCharges(response.extraCharges);
        setCartDetail(response.cart);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCartDetails();
  }, []);

  return (
    <Fragment>
      <XStack flex={1} flexWrap='wrap' padding='$4' justifyContent='center'>
        <YStack flex={1} padding='$4'>
          {deliveryAddress ? (
            <PaymentDetails
              cartDetail={cartDetail}
              deliveryAddress={deliveryAddress}
              extraCharges={extraCharges}
            />
          ) : (
            <ScrollView>
              <AddressList />
            </ScrollView>
          )}
        </YStack>

        {loading ? (
          <YStack width='30%' padding='$4'>
            <Card bordered padding='$4' backgroundColor='$cardBackground'>
              <Spinner />
            </Card>
          </YStack>
        ) : (
          <OrderSummary
            isVisiableButButton={false}
            cartDetail={cartDetail}
            extraCharges={extraCharges}
          />
        )}
      </XStack>
    </Fragment>
  );
};

export default Checkout;
