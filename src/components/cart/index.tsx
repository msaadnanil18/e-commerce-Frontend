'use client';
import React, { FC, Fragment, useEffect, useState } from 'react';
import {
  Text,
  Button,
  Card,
  Separator,
  XStack,
  YStack,
  ScrollView,
  Spinner,
} from 'tamagui';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';
import Navbar from '../navbar';
import { ServiceErrorManager } from '@/helpers/service';
import {
  GetCartPageDetailsService,
  ProductCartQuantityAddRemove,
  RemoveProductFormCartServie,
} from '@/services/cart';
import { ICart } from '@/types/cart';
import RenderDriveFile from '../appComponets/fileupload/RenderDriveFile';
import PriceFormatter from '../appComponets/PriceFormatter/PriceFormatter';
import Loader from '../admin/organism/Loader';
import { IAddress } from '@/types/address';
import CartDefaulAddress from './CartDefaulAddress';
import OrderSummary from './OrderSummary';
import { useRouter } from 'next/navigation';
import { useScreen } from '@/hook/useScreen';

const CartPage: FC = () => {
  const media = useScreen();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectItem, setSelectedItem] = useState<string>('');
  const [cartDetail, setCartDetails] = useState<ICart | null>(null);
  const [updatedLoadingPlus, setUpdatedLoadingPlus] = useState<boolean>(false);
  const [updatedLoadingMinus, setUpdatedLoadingMinus] =
    useState<boolean>(false);
  const [removeLoading, setRemoveLoading] = useState<boolean>(false);
  const [defaultAddres, setDefaulAddress] = useState<IAddress | null>(null);
  const [extraCharges, setExtraCharges] = useState<object | null>(null);

  const fetchCartDetails = () => {
    setLoading(true);
    ServiceErrorManager(GetCartPageDetailsService(), {})
      .then(([_, response]) => {
        setDefaulAddress(response?.defaultAddress);
        setCartDetails(response?.cart);
        setExtraCharges(response?.extraCharges);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  };

  const updateQuantity = async (id: string, delta: number) => {
    setSelectedItem(id);
    if (delta === 1) setUpdatedLoadingPlus(true);
    else setUpdatedLoadingMinus(true);

    const [_, data] = await ServiceErrorManager(
      ProductCartQuantityAddRemove({
        data: {
          payload: {
            variantId: id,
            change: delta,
          },
        },
      }),
      {}
    );

    if (delta === 1) setUpdatedLoadingPlus(false);
    else setUpdatedLoadingMinus(false);
    setCartDetails(data?.cart);
  };

  const removeFromCart = (id: string) => {
    setRemoveLoading(true);
    ServiceErrorManager(
      RemoveProductFormCartServie({
        data: {
          usePayloadUpdate: true,
          payload: {
            variantId: id,
          },
        },
      }),
      {}
    )
      .then(([_, response]) => setCartDetails(response?.cart))
      .finally(() => setRemoveLoading(false));
  };

  // const total = subtotal + tax;

  // const total = (cartDetail?.items || []).reduce((sum, item) => {
  //   const variant = item.;
  //   return sum + (variant?.discount || 0) * item.quantity;
  // }, 0);

  useEffect(() => {
    fetchCartDetails();
  }, []);

  return (
    <Fragment>
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <YStack>
          <XStack flex={1} flexWrap='wrap' padding='$4' justifyContent='center'>
            <YStack
              {...(media.xs
                ? {
                    flex: 1,
                    flexWrap: 'wrap',
                  }
                : { width: '65%' })}
              padding={media.xs ? '$1' : '$4'}
            >
              <CartDefaulAddress
                defaultAddres={defaultAddres}
                reload={fetchCartDetails}
              />

              <ScrollView
                maxHeight={media.xs ? 250 : 360}
                showsVerticalScrollIndicator
              >
                {(cartDetail?.items || [])?.length === 0 ? (
                  <Text fontSize={media.sm ? '$4' : '$5'} color='$gray10'>
                    Your cart is empty.
                  </Text>
                ) : (
                  <YStack gap='$4'>
                    {(cartDetail?.items || [])?.map((item) => {
                      const variant = item.product.variants.find(
                        (v) => v._id.toString() === item.variant.toString()
                      );
                      return (
                        <Card
                          key={item._id}
                          width='100%'
                          padding={media.sm ? '$3' : '$4'}
                        >
                          <XStack
                            gap={media.sm ? '$2' : '$3'}
                            alignItems='center'
                            flexDirection={media.xs ? 'column' : 'row'}
                          >
                            <RenderDriveFile
                              file={item.product.thumbnail}
                              style={{
                                width: media.xs ? 60 : 80,
                                height: media.xs ? 60 : 80,
                                alignSelf: media.xs ? 'center' : 'flex-start',
                              }}
                            />

                            <YStack
                              flex={1}
                              alignItems={media.xs ? 'center' : 'flex-start'}
                            >
                              <Text
                                onPress={() =>
                                  router.push(
                                    `/product-details/${item.product._id}`
                                  )
                                }
                                hoverStyle={{
                                  color: '$linkColor',
                                  cursor: 'pointer',
                                }}
                                fontSize={media.sm ? '$2' : '$3'}
                                fontWeight='500'
                                textAlign={media.xs ? 'center' : 'left'}
                              >
                                {item.product.name}
                              </Text>
                              <Text
                                fontSize={media.sm ? '$3' : '$4'}
                                color='$primary'
                                fontWeight='700'
                              >
                                <PriceFormatter
                                  value={item.price * item.quantity}
                                />
                              </Text>
                              <XStack
                                alignItems='center'
                                gap='$2'
                                marginTop={media.xs ? '$2' : '0'}
                              >
                                <Button
                                  size={media.sm ? '$1' : '$2'}
                                  onPress={() =>
                                    updateQuantity(item.variant, -1)
                                  }
                                  disabled={
                                    item.quantity === 1 || updatedLoadingMinus
                                  }
                                  icon={
                                    updatedLoadingMinus &&
                                    selectItem === item.variant ? (
                                      <Spinner />
                                    ) : (
                                      <CiCircleMinus
                                        size={media.sm ? 16 : 20}
                                      />
                                    )
                                  }
                                />

                                <Text
                                  fontSize={media.sm ? '$3' : '$4'}
                                  fontWeight='600'
                                >
                                  {item.quantity}
                                </Text>
                                <Button
                                  size={media.sm ? '$1' : '$2'}
                                  onPress={() => {
                                    updateQuantity(item.variant, 1);
                                  }}
                                  disabled={updatedLoadingPlus}
                                  icon={
                                    updatedLoadingPlus &&
                                    selectItem === item.variant ? (
                                      <Spinner />
                                    ) : (
                                      <CiCirclePlus size={media.sm ? 16 : 20} />
                                    )
                                  }
                                />
                              </XStack>
                            </YStack>
                            <Button
                              unstyled
                              color='$color'
                              hoverStyle={{
                                //@ts-ignore
                                color: '$linkColor',
                              }}
                              hoverTheme={false}
                              size={media.sm ? '$2' : '$3'}
                              fontSize={media.sm ? '$3' : '$4'}
                              chromeless
                              onPress={() => {
                                removeFromCart(item.variant);
                                setSelectedItem(item.variant);
                              }}
                              disabled={removeLoading}
                              marginTop={media.xs ? '$2' : '0'}
                            >
                              {removeLoading && selectItem === item.variant
                                ? 'Removing...'
                                : 'Remove'}
                            </Button>
                          </XStack>
                          <Separator marginTop='$2' />
                        </Card>
                      );
                    })}
                  </YStack>
                )}
              </ScrollView>
            </YStack>

            <OrderSummary cartDetail={cartDetail} extraCharges={extraCharges} />
          </XStack>
        </YStack>
      )}
    </Fragment>
  );
};

export default CartPage;
