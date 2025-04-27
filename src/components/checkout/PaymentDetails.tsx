'use client';
import { ServiceErrorManager } from '@/helpers/service';
import { CreateNewOrderService } from '@/services/order';
import { ICart } from '@/types/cart';
import { truncate } from 'lodash-es';
import { useRouter } from 'next/navigation';
import React, { FC, useState } from 'react';
import { FiCheckCircle, FiCreditCard, FiLock } from 'react-icons/fi';
import {
  ScrollView,
  YStack,
  XStack,
  Card,
  Text,
  RadioGroup,
  Input,
  Button,
  Spinner,
} from 'tamagui';

const PaymentDetails: FC<{
  cartDetail: ICart | null;
  deliveryAddress: string;
  extraCharges: object | null;
}> = ({ cartDetail, deliveryAddress, extraCharges }) => {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const handelOnSaveOrder = () => {
    setSubmitLoading(true);
    ServiceErrorManager(
      CreateNewOrderService({
        data: {
          payload: {
            items: cartDetail?.items.map((item) => ({
              product: item.product._id,
              seller: item.product.seller,
              variant: item.variant,
              quantityOrdered: item.quantity,
              price: item.price,
            })),
            paymentStatus: 'pending',
            deliveryCharge: (extraCharges as any)?.total?.delivery || 0,
            serviceCharge: (extraCharges as any)?.total?.service || 0,
            shippingAddress: deliveryAddress,
            totalAmount:
              cartDetail?.totalPrice +
              ((extraCharges as any)?.total?.delivery || 0) +
              ((extraCharges as any)?.total?.service || 0),
            taxAmount: 0,
            gstNumber: null,
          },
        },
      }),
      {}
    ).then(([_, response]) => {
      router.push(`/order-confirmation?order-id=${response?.data?._id}`);
      setSubmitLoading(false);
    });
  };
  return (
    <ScrollView>
      <YStack>
        <XStack flexWrap='wrap'>
          <YStack flex={1} minWidth={320} space='$2'>
            <Card padding='$4' space='$3'>
              <XStack alignItems='center' space='$2'>
                <FiCreditCard size={20} />
                <Text fontSize='$3.5' fontWeight='bold'>
                  Payment Method
                </Text>
              </XStack>

              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <XStack padding='$2' alignItems='center' space='$4'>
                  <RadioGroup.Item value='card'>
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>
                  <Text>Credit/Debit Card</Text>
                </XStack>

                {paymentMethod === 'card' && (
                  <YStack space='$2' paddingLeft='$6'>
                    <Input placeholder='Card Number' />
                    <XStack space='$2'>
                      <Input flex={1} placeholder='MM/YY' />
                      <Input flex={1} placeholder='CVV' />
                    </XStack>
                    <Input placeholder='Cardholder Name' />
                  </YStack>
                )}

                <XStack padding='$2' alignItems='center' space='$4'>
                  <RadioGroup.Item value='paypal'>
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>
                  <Text>Paytm</Text>
                </XStack>

                <XStack padding='$2' alignItems='center' space='$4'>
                  <RadioGroup.Item value='applePay'>
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>
                  <Text>Phone Pay</Text>
                </XStack>
              </RadioGroup>
            </Card>
          </YStack>

          <YStack flex={1} minWidth={320} space='$4'>
            <Card padding='$4' space='$3'>
              <Text fontSize='$3.5' fontWeight='bold'>
                Order Items
              </Text>

              <YStack space='$2' marginTop='$2'>
                {cartDetail?.items?.map((item) => (
                  <XStack key={item._id} justifyContent='space-between'>
                    <Text>
                      {truncate(item.product.name, { length: 80 })} x
                      {item.quantity}
                    </Text>
                  </XStack>
                ))}
              </YStack>
            </Card>

            <Card padding='$4'>
              <Text fontSize='$3.5' fontWeight='bold' marginBottom='$2'>
                Promo Code
              </Text>
              <XStack space='$2'>
                <Input flex={1} placeholder='Enter code' />
                <Button>Apply</Button>
              </XStack>
            </Card>

            <Button
              size='$3'
              backgroundColor='$primary'
              color='white'
              disabled={submitLoading}
              icon={submitLoading ? <Spinner /> : <FiCheckCircle />}
              onPress={handelOnSaveOrder}
              marginTop='$2'
            >
              Place Order
            </Button>

            <XStack
              alignItems='center'
              justifyContent='center'
              space='$2'
              opacity={0.7}
              marginTop='$2'
            >
              <FiLock size={14} />
              <Text fontSize='$3'>
                Secure checkout • All information is encrypted
              </Text>
            </XStack>
          </YStack>
        </XStack>
      </YStack>
    </ScrollView>
  );
};

export default PaymentDetails;
