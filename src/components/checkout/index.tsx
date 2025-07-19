'use client';

import React, { FC, Fragment, useEffect, useState } from 'react';
import { XStack, YStack, ScrollView, Card, Spinner } from 'tamagui';
import { ServiceErrorManager } from '@/helpers/service';
import { GetCartPageDetailsService } from '@/services/cart';
import { ICart } from '@/types/cart';
import AddressList from '@/components/checkout/AddressList';
import OrderSummary from '@/components/cart/OrderSummary';
import PaymentDetails from '@/components/checkout/PaymentDetails';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store/store';

const Checkout: FC = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const searchParams = useSearchParams();
  const deliveryAddress = searchParams.get('delivery-address');

  const [cartDetail, setCartDetail] = useState<ICart | null>(null);
  const [extraCharges, setExtraCharges] = useState<object | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user.isAuthenticated) {
      router.replace(`/login?redirect=/cart`);
    }
  }, [user.isAuthenticated, router]);

  const fetchCartDetails = () => {
    if (!user.isAuthenticated) return;
    setLoading(true);
    ServiceErrorManager(GetCartPageDetailsService(), {})
      .then(([_, response]) => {
        setExtraCharges(response.extraCharges);
        setCartDetail(response.cart);
        if (!response?.cart?.items?.length) {
          router.push(`/cart`);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCartDetails();
  }, []);

  if (!user.isAuthenticated || loading) {
    return (
      <YStack flex={1} justifyContent='center' alignItems='center'>
        <Spinner size='large' />
      </YStack>
    );
  }

  return (
    <Fragment>
      <XStack flex={1} flexWrap='wrap' padding='$2' justifyContent='center'>
        {deliveryAddress ? (
          <PaymentDetails
            cartDetail={cartDetail}
            deliveryAddress={deliveryAddress}
            extraCharges={extraCharges}
          />
        ) : (
          <ScrollView
            flex={1}
            maxHeight={500}
            paddingHorizontal='$6'
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            <AddressList />
          </ScrollView>
        )}
        <OrderSummary
          isVisiableButButton={false}
          cartDetail={cartDetail}
          extraCharges={extraCharges}
        />
      </XStack>
    </Fragment>
  );
};

export default Checkout;
