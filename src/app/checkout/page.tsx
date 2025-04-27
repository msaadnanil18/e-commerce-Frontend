'use client';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { XStack, YStack, ScrollView, Card, Spinner } from 'tamagui';
import { ServiceErrorManager } from '@/helpers/service';
import {
  CalculateProductExtraChargesService,
  GetCartDetailsService,
} from '@/services/cart';
import { ICart } from '@/types/cart';
import AddressList from '@/components/checkout/AddressList';
import OrderSummary from '@/components/cart/OrderSummary';
import PaymentDetails from '@/components/checkout/PaymentDetails';

interface CheckoutPageProps {
  searchParams: { 'delivery-address'?: string };
}
const Checkout: FC<CheckoutPageProps> = ({ searchParams }) => {
  const deliveryAddress = searchParams['delivery-address'];
  const [cartDetail, setCartDetail] = useState<ICart | null>(null);
  const [extraCharges, setExtraCharges] = useState<object | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchCartDetails = () => {
    setLoading(true);
    Promise.all([
      ServiceErrorManager(CalculateProductExtraChargesService(), {}),
      ServiceErrorManager(GetCartDetailsService(), {}),
    ])
      .then(([[, _extraCharges], [, _cartDetail]]) => {
        setCartDetail(_cartDetail);
        setExtraCharges(_extraCharges);
      })
      .catch(console.log)
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
        <YStack width='65%' padding='$4'>
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
