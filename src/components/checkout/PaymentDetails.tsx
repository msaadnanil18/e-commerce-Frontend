'use client';
import { ServiceErrorManager } from '@/helpers/service';
import { CreateNewOrderService } from '@/services/order';
import { ICart } from '@/types/cart';
import { truncate } from 'lodash-es';
import { useRouter } from 'next/navigation';
import React, { FC, useState } from 'react';
import {
  FiCheckCircle,
  FiCreditCard,
  FiTruck,
  FiPercent,
  FiShield,
  FiAlertCircle,
} from 'react-icons/fi';
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
  styled,
  View,
} from 'tamagui';
import PriceFormatter from '../appComponets/PriceFormatter/PriceFormatter';

const AnimatedCard = styled(Card, {
  animation: 'bouncy',
  variants: {
    active: {
      true: {
        borderColor: '$primary',
        borderWidth: 2,
        shadowColor: '$shadowColor',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        transform: [{ scale: 1.02 }],
      },
      false: {
        borderColor: '$borderColor',
        borderWidth: 1,
        transform: [{ scale: 1 }],
      },
    },
  },
});

const PulseButton = styled(Button, {
  variants: {
    loading: {
      true: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
      },
    },
  },
});

const PaymentMethodCard = styled(Card, {
  minWidth: 600,
  cursor: 'pointer',
  hoverStyle: {
    backgroundColor: '$backgroundHover',
  },
});

const PaymentDetails: FC<{
  cartDetail: ICart | null;
  deliveryAddress: string;
  extraCharges: object | null;
}> = ({ cartDetail, deliveryAddress, extraCharges }) => {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [cardErrors, setCardErrors] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const validateCard = (field: string, value: string) => {
    const errors = { ...cardErrors };

    switch (field) {
      case 'cardNumber':
        if (value.length > 0 && value.length < 16) {
          errors.cardNumber = 'Card number must be 16 digits';
        } else {
          errors.cardNumber = '';
        }
        break;
      case 'expiry':
        if (value.length > 0 && !/^\d{2}\/\d{2}$/.test(value)) {
          errors.expiry = 'Format: MM/YY';
        } else {
          errors.expiry = '';
        }
        break;
      case 'cvv':
        if (value.length > 0 && value.length < 3) {
          errors.cvv = 'CVV must be 3-4 digits';
        } else {
          errors.cvv = '';
        }
        break;
      case 'name':
        if (value.length > 0 && value.length < 2) {
          errors.name = 'Name is required';
        } else {
          errors.name = '';
        }
        break;
    }

    setCardErrors(errors);
  };

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
      // Simulate promo application
      setTimeout(() => setPromoApplied(false), 2000);
    }
  };

  // const handelOnSaveOrder = () => {
  //   setSubmitLoading(true);
  //   ServiceErrorManager(
  //     CreateNewOrderService({
  //       data: {
  //         payload: {
  //           items: cartDetail?.items.map((item) => ({
  //             product: item.product._id,
  //             seller: item.product.seller,
  //             variant: item.variant,
  //             quantityOrdered: item.quantity,
  //             price: item.price,
  //           })),
  //           paymentStatus: 'pending',
  //           deliveryCharge: (extraCharges as any)?.total?.delivery || 0,
  //           serviceCharge: (extraCharges as any)?.total?.service || 0,
  //           shippingAddress: deliveryAddress,
  //           totalAmount:
  //             cartDetail?.totalPrice +
  //             ((extraCharges as any)?.total?.delivery || 0) +
  //             ((extraCharges as any)?.total?.service || 0),
  //           taxAmount: 0,
  //           gstNumber: null,
  //         },
  //       },
  //     }),
  //     {}
  //   ).then(([_, response]) => {
  //     router.push(`/order-confirmation?order-id=${response?.data?._id}`);
  //     setSubmitLoading(false);
  //   });
  // };
  const totalAmount =
    (cartDetail?.finalPrice || 0) +
    ((extraCharges as any)?.total?.delivery || 0) +
    ((extraCharges as any)?.total?.service || 0);
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
              price: item.finalPrice,
            })),
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
            paymentMethod: paymentMethod,
            deliveryCharge: (extraCharges as any)?.total?.delivery || 0,
            serviceCharge: (extraCharges as any)?.total?.service || 0,
            shippingAddress: deliveryAddress,
            totalAmount: totalAmount,
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
      <YStack space='$4'>
        <XStack flexWrap='wrap' space='$4'>
          <YStack flex={1} minWidth={320} space='$4'>
            {/* Payment Method Selection */}
            <AnimatedCard padding='$4' space='$4' active={true}>
              <XStack alignItems='center' space='$2' marginBottom='$2'>
                <FiCreditCard size={20} color='$primary' />
                <Text fontSize='$4' fontWeight='bold' color='$primary'>
                  Choose Payment Method
                </Text>
              </XStack>

              <RadioGroup
                value={paymentMethod}
                onValueChange={(e) => {
                  setPaymentMethod(e);
                }}
                name={paymentMethod}
                space='$3'
              >
                <PaymentMethodCard
                  padding='$3'
                  backgroundColor={
                    paymentMethod === 'card'
                      ? '$primaryTransparent'
                      : '$background'
                  }
                >
                  <XStack alignItems='center' space='$3'>
                    <RadioGroup.Item value='card' id='card' size='$4'>
                      <RadioGroup.Indicator />
                    </RadioGroup.Item>
                    <FiCreditCard
                      size={18}
                      color={paymentMethod === 'card' ? '$primary' : '$color'}
                    />
                    <YStack flex={1}>
                      <Text
                        fontWeight={
                          paymentMethod === 'card' ? 'bold' : 'normal'
                        }
                      >
                        Credit/Debit Card
                      </Text>
                      <Text fontSize='$2' opacity={0.7}>
                        Visa, Mastercard, RuPay accepted
                      </Text>
                    </YStack>
                    <FiShield size={16} color='$green10' />
                  </XStack>
                </PaymentMethodCard>

                {paymentMethod === 'card' && (
                  <YStack space='$3' paddingLeft='$6' paddingRight='$2'>
                    <YStack space='$2'>
                      <Input
                        placeholder='1234 5678 9012 3456'
                        keyboardType='numeric'
                        maxLength={19}
                        onChangeText={(value) =>
                          validateCard('cardNumber', value)
                        }
                      />
                      {/* {cardErrors.cardNumber && (
                        <XStack alignItems='center' space='$1'>
                          <FiAlertCircle size={12} color='$red10' />
                          <Text fontSize='$2' color='$red10'>
                            {cardErrors.cardNumber}
                          </Text>
                        </XStack>
                      )} */}
                    </YStack>

                    <XStack space='$2'>
                      <YStack flex={1} space='$2'>
                        <Input
                          placeholder='MM/YY'
                          keyboardType='numeric'
                          maxLength={5}
                          onChangeText={(value) =>
                            validateCard('expiry', value)
                          }
                        />
                        {/* {cardErrors.expiry && (
                          <Text fontSize='$1' color='$red10'>
                            {cardErrors.expiry}
                          </Text>
                        )} */}
                      </YStack>
                      <YStack flex={1} space='$2'>
                        <Input
                          placeholder='CVV'
                          keyboardType='numeric'
                          maxLength={4}
                          secureTextEntry
                          onChangeText={(value) => validateCard('cvv', value)}
                        />
                        {/* {cardErrors.cvv && (
                          <Text fontSize='$1' color='$red10'>
                            {cardErrors.cvv}
                          </Text>
                        )} */}
                      </YStack>
                    </XStack>

                    <YStack space='$2'>
                      <Input
                        placeholder='Cardholder Name'
                        onChangeText={(value) => validateCard('name', value)}
                      />
                      {/* {cardErrors.name && (
                        <XStack alignItems='center' space='$1'>
                          <FiAlertCircle size={12} color='$red10' />
                          <Text fontSize='$2' color='$red10'>
                            {cardErrors.name}
                          </Text>
                        </XStack>
                      )} */}
                    </YStack>
                  </YStack>
                )}

                <PaymentMethodCard
                  padding='$3'
                  backgroundColor={
                    paymentMethod === 'paytm'
                      ? '$primaryTransparent'
                      : '$background'
                  }
                >
                  <XStack alignItems='center' space='$3'>
                    <RadioGroup.Item value='paytm' id='paytm' size='$4'>
                      <RadioGroup.Indicator />
                    </RadioGroup.Item>

                    <YStack flex={1}>
                      <Text
                        fontWeight={
                          paymentMethod === 'paytm' ? 'bold' : 'normal'
                        }
                      >
                        Paytm
                      </Text>
                      <Text fontSize='$2' opacity={0.7}>
                        Quick & secure UPI payment
                      </Text>
                    </YStack>
                  </XStack>
                </PaymentMethodCard>

                <PaymentMethodCard
                  padding='$3'
                  backgroundColor={
                    paymentMethod === 'phonePay'
                      ? '$primaryTransparent'
                      : '$background'
                  }
                >
                  <XStack alignItems='center' space='$3'>
                    <RadioGroup.Item value='phonePay' id='phonePay' size='$4'>
                      <RadioGroup.Indicator />
                    </RadioGroup.Item>

                    <YStack flex={1}>
                      <Text
                        fontWeight={
                          paymentMethod === 'phonePay' ? 'bold' : 'normal'
                        }
                      >
                        PhonePe
                      </Text>
                      <Text fontSize='$2' opacity={0.7}>
                        Pay with PhonePe UPI
                      </Text>
                    </YStack>
                  </XStack>
                </PaymentMethodCard>

                <PaymentMethodCard
                  padding='$3'
                  backgroundColor={
                    paymentMethod === 'cod'
                      ? '$primaryTransparent'
                      : '$background'
                  }
                >
                  <XStack alignItems='center' space='$3'>
                    <RadioGroup.Item value='cod' id='cod' size='$4'>
                      <RadioGroup.Indicator />
                    </RadioGroup.Item>
                    <FiTruck
                      size={18}
                      color={paymentMethod === 'cod' ? '$primary' : '$color'}
                    />
                    <YStack flex={1}>
                      <Text
                        fontWeight={paymentMethod === 'cod' ? 'bold' : 'normal'}
                      >
                        Cash on Delivery
                      </Text>
                      <Text fontSize='$2' opacity={0.7}>
                        Pay when your order arrives
                      </Text>
                    </YStack>
                    <Text fontSize='$2' color='$green10' fontWeight='bold'>
                      FREE
                    </Text>
                  </XStack>
                </PaymentMethodCard>

                {paymentMethod === 'cod' && (
                  <Card padding='$3' marginLeft='$6' backgroundColor='$yellow2'>
                    <XStack alignItems='center' space='$2'>
                      <FiAlertCircle size={16} color='$yellow10' />
                      <Text fontSize='$2' color='$yellow11'>
                        Please keep exact change ready. Our delivery partner
                        will collect <PriceFormatter value={totalAmount} /> at
                        your doorstep.
                      </Text>
                    </XStack>
                  </Card>
                )}
              </RadioGroup>
            </AnimatedCard>
          </YStack>

          <YStack flex={1} minWidth={320} space='$4'>
            <Card padding='$4' space='$3'>
              <Text fontSize='$4' fontWeight='bold' marginBottom='$2'>
                Order Summary
              </Text>

              <YStack space='$3'>
                {cartDetail?.items?.map((item) => (
                  <XStack
                    key={item._id}
                    justifyContent='space-between'
                    paddingVertical='$2'
                  >
                    <Text flex={1} fontSize='$3'>
                      {truncate(item.product.name, { length: 50 })}
                    </Text>
                    <Text fontSize='$3' opacity={0.7}>
                      × {item.quantity}
                    </Text>
                    <Text
                      fontSize='$3'
                      fontWeight='bold'
                      minWidth='$6'
                      textAlign='right'
                    >
                      <PriceFormatter value={item?.finalPrice} />
                    </Text>
                  </XStack>
                ))}

                <YStack
                  space='$2'
                  paddingTop='$2'
                  borderTopWidth={1}
                  borderTopColor='$borderColor'
                >
                  <XStack justifyContent='space-between'>
                    <Text>Subtotal</Text>
                    <Text>₹{cartDetail?.totalPrice}</Text>
                  </XStack>
                  <XStack justifyContent='space-between'>
                    <Text>Delivery</Text>
                    <Text>₹{(extraCharges as any)?.total?.delivery || 0}</Text>
                  </XStack>
                  <XStack justifyContent='space-between'>
                    <Text>Service Fee</Text>
                    <Text>₹{(extraCharges as any)?.total?.service || 0}</Text>
                  </XStack>
                  <XStack
                    justifyContent='space-between'
                    paddingTop='$2'
                    borderTopWidth={1}
                    borderTopColor='$borderColor'
                  >
                    <Text fontSize='$4' fontWeight='bold'>
                      Total
                    </Text>
                    <Text fontSize='$4' fontWeight='bold' color='$primary'>
                      <PriceFormatter value={totalAmount} />
                    </Text>
                  </XStack>
                </YStack>
              </YStack>
            </Card>

            {/* Promo Code */}
            <Card padding='$4'>
              <XStack alignItems='center' space='$2' marginBottom='$3'>
                <FiPercent size={18} color='$primary' />
                <Text fontSize='$3.5' fontWeight='bold'>
                  Promo Code
                </Text>
              </XStack>
              <XStack space='$2'>
                <Input
                  flex={1}
                  placeholder='Enter discount code'
                  value={promoCode}
                  onChangeText={setPromoCode}
                />
                <Button
                  onPress={handleApplyPromo}
                  backgroundColor={promoApplied ? '$green10' : '$primary'}
                  disabled={!promoCode.trim() || promoApplied}
                  icon={promoApplied ? <FiCheckCircle /> : undefined}
                >
                  {promoApplied ? 'Applied' : 'Apply'}
                </Button>
              </XStack>
            </Card>

            <PulseButton
              size='$4'
              backgroundColor='$primary'
              color='white'
              disabled={paymentMethod !== 'cod' || submitLoading}
              loading={submitLoading}
              icon={
                submitLoading ? <Spinner color='white' /> : <FiCheckCircle />
              }
              onPress={handelOnSaveOrder}
              marginTop='$2'
              fontSize='$4'
              fontWeight='bold'
              animation='bouncy'
              hoverStyle={{
                backgroundColor: '$primaryHover',
              }}
            >
              {submitLoading ? (
                'Processing...'
              ) : (
                <View
                  flex={1}
                  flexDirection='row'
                  alignItems='center'
                  justifyContent='center'
                  space='$2'
                >
                  <Text>Place Order•</Text>
                  <PriceFormatter value={totalAmount} />
                </View>
              )}
            </PulseButton>

            {paymentMethod === 'cod' && (
              <Card padding='$3' backgroundColor='$blue2'>
                <XStack alignItems='center' space='$2'>
                  <FiTruck size={16} color='$blue10' />
                  <Text fontSize='$2' color='$blue11'>
                    Cash on Delivery: No online payment required. Pay directly
                    to our delivery partner.
                  </Text>
                </XStack>
              </Card>
            )}
          </YStack>
        </XStack>
      </YStack>
    </ScrollView>
  );
};

export default PaymentDetails;
