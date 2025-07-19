'use client';
import React, { useEffect, useState } from 'react';

import {
  XStack,
  YStack,
  Button,
  Text,
  Separator,
  ScrollView,
  Card,
  Spinner,
  Avatar,
  View,
} from 'tamagui';
import {
  FiCheckCircle,
  FiPrinter,
  FiHome,
  FiPackage,
  FiMapPin,
  FiCalendar,
  FiMail,
  FiCreditCard,
  FiTruck,
  FiUser,
  FiTag,
  FiInfo,
  FiClock,
  FiDollarSign,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import { ServiceErrorManager } from '@/helpers/service';
import {
  GenerateCustomerOrderBillService,
  GetOrderDetailsService,
} from '@/services/order';
import { downloadPDF } from '@/helpers/PdfDownload';
import { useSearchParams } from 'next/navigation';
import { IOrder } from '@/types/order';
import RenderDriveFile from '@/components/appComponets/fileupload/RenderDriveFile';
import PriceFormatter from '@/components/appComponets/PriceFormatter/PriceFormatter';

const OrderConfirmationPage = () => {
  const searchParam = useSearchParams();
  const orderId = searchParam.get('order-id');
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const fetchOrderDetails = async () => {
    if (!orderId) return;
    setIsLoading(true);
    const [_, data] = await ServiceErrorManager(
      GetOrderDetailsService(orderId)(),
      {}
    );
    setOrderDetails(data || null);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const generatePdf = async () => {
    setIsGeneratingPdf(true);
    await ServiceErrorManager(
      GenerateCustomerOrderBillService({
        data: {
          orderId,
        },
      }),
      {
        failureMessage: 'PDF is corrupted. Please try again',
      }
    )
      .then(([, data]) => downloadPDF(data))
      .finally(() => setIsGeneratingPdf(false));
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleTrackOrder = () => {
    if (orderDetails) {
      router.push(`/order-tracking/${orderDetails.orderNumber}`);
    }
  };

  const handlePrintReceipt = async () => {
    await generatePdf();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'delivered':
      case 'completed':
        return '$green9';
      case 'processing':
      case 'partially_shipped':
      case 'shipped':
        return '$blue9';
      case 'pending':
        return '$yellow9';
      case 'canceled':
        return '$red9';
      default:
        return '$gray9';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '$green9';
      case 'pending':
        return '$yellow9';
      case 'failed':
      case 'refunded':
        return '$red9';
      case 'partial':
        return '$orange9';
      default:
        return '$gray9';
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className=' h-screen'>
        <Navbar />
        <ScrollView>
          <YStack alignItems='center' justifyContent='center' minHeight='400px'>
            <Spinner size='large' />
            <Text marginTop='$4'>Loading order details...</Text>
          </YStack>
        </ScrollView>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <ScrollView>
        <Navbar />
        <YStack alignItems='center' justifyContent='center' minHeight='400px'>
          <Text fontSize='$6' fontWeight='bold'>
            Order Not Found
          </Text>
          <Text marginTop='$2' color='$gray10'>
            We couldn't find the order you're looking for.
          </Text>
          <Button marginTop='$4' onPress={handleGoHome}>
            Go Home
          </Button>
        </YStack>
      </ScrollView>
    );
  }

  return (
    <div>
      <Navbar showSearchInput={false} showRoleChange={false} />
      <ScrollView>
        <YStack padding='$4' space='$4' maxWidth={1200} marginHorizontal='auto'>
          <YStack alignItems='center' space='$2' marginVertical='$6'>
            <XStack
              backgroundColor='$green3'
              padding='$4'
              borderRadius='$6'
              marginBottom='$2'
            >
              <FiCheckCircle size={48} color='green' />
            </XStack>
            <Text fontSize='$5' fontWeight='bold' textAlign='center'>
              Order Confirmed!
            </Text>
            <Text fontSize='$5' textAlign='center' color='$gray11'>
              Order #{orderDetails.orderNumber} has been placed successfully.
            </Text>
            <Text fontSize='$3' textAlign='center' color='$gray10'>
              A confirmation email has been sent to{' '}
              {orderDetails.customer.email || 'your email address'}.
            </Text>

            <Text
              marginTop='$3'
              paddingHorizontal='$4'
              paddingVertical='$2'
              borderRadius='$6'
              backgroundColor={getStatusColor(orderDetails.overallStatus)}
              color='white'
              fontWeight='bold'
              textTransform='uppercase'
            >
              {orderDetails.overallStatus.replace('_', ' ')}
            </Text>
          </YStack>

          <XStack flexWrap='wrap' gap='$4'>
            <YStack flex={1} minWidth={320} space='$4'>
              <Card
                bordered
                padding='$4'
                space='$3'
                backgroundColor='$background'
              >
                <XStack justifyContent='space-between' alignItems='center'>
                  <Text fontSize='$5' fontWeight='bold'>
                    Order Information
                  </Text>

                  <Text
                    backgroundColor={getPaymentStatusColor(
                      orderDetails.paymentStatus
                    )}
                    color='white'
                    paddingHorizontal='$3'
                    paddingVertical='$1'
                    fontSize='$3'
                    textTransform='uppercase'
                  >
                    {orderDetails.paymentStatus}
                  </Text>
                </XStack>
                <Separator marginVertical='$2' />

                <YStack space='$4'>
                  <XStack space='$3' alignItems='center'>
                    <FiCalendar size={20} color='$blue9' />
                    <YStack>
                      <Text fontSize='$2' color='$gray10' fontWeight='600'>
                        ORDER DATE
                      </Text>
                      <Text fontSize='$4'>
                        {formatDate(orderDetails.createdAt)}
                      </Text>
                    </YStack>
                  </XStack>

                  {orderDetails.estimatedDeliveryDate && (
                    <XStack space='$3' alignItems='center'>
                      <FiTruck size={20} color='$green9' />
                      <YStack>
                        <Text fontSize='$2' color='$gray10' fontWeight='600'>
                          ESTIMATED DELIVERY
                        </Text>
                        <Text fontSize='$4'>
                          {formatDate(orderDetails.estimatedDeliveryDate)}
                        </Text>
                      </YStack>
                    </XStack>
                  )}

                  <XStack space='$3' alignItems='flex-start'>
                    <FiMapPin size={20} color='$purple9' />
                    <YStack flex={1}>
                      <Text fontSize='$2' color='$gray10' fontWeight='600'>
                        SHIPPING ADDRESS
                      </Text>
                      <Text fontSize='$4' fontWeight='600'>
                        {orderDetails.shippingAddress.name}
                      </Text>

                      <Text>
                        {orderDetails.shippingAddress.city},{' '}
                        {orderDetails.shippingAddress.state}{' '}
                        {orderDetails.shippingAddress.postalCode}
                      </Text>
                      <Text>{orderDetails.shippingAddress.country}</Text>
                      {orderDetails.shippingAddress.phoneNumber && (
                        <Text color='$gray10'>
                          📞 {orderDetails.shippingAddress.phoneNumber}
                        </Text>
                      )}
                    </YStack>
                  </XStack>

                  {orderDetails.paymentMethod && (
                    <XStack space='$3' alignItems='center'>
                      <FiCreditCard size={20} color='$orange9' />
                      <YStack>
                        <Text fontSize='$2' color='$gray10' fontWeight='600'>
                          PAYMENT METHOD
                        </Text>
                        <Text fontSize='$4'>{orderDetails.paymentMethod}</Text>
                        {orderDetails.paymentTransactionId && (
                          <Text fontSize='$2' color='$gray10'>
                            Transaction: {orderDetails.paymentTransactionId}
                          </Text>
                        )}
                      </YStack>
                    </XStack>
                  )}

                  {orderDetails.couponCode && (
                    <XStack space='$3' alignItems='center'>
                      <FiTag size={20} color='$red9' />
                      <YStack>
                        <Text fontSize='$2' color='$gray10' fontWeight='600'>
                          COUPON APPLIED
                        </Text>
                        <Text fontSize='$4'>{orderDetails.couponCode}</Text>
                        <Text fontSize='$3' color='$green10'>
                          Saved
                          <PriceFormatter
                            value={orderDetails.couponDiscount}
                          />{' '}
                        </Text>
                      </YStack>
                    </XStack>
                  )}
                </YStack>
              </Card>

              {/* Customer Info */}
              <Card
                bordered
                padding='$4'
                space='$3'
                backgroundColor='$background'
              >
                <Text fontSize='$5' fontWeight='bold'>
                  Customer Information
                </Text>
                <Separator marginVertical='$2' />

                <XStack space='$3' alignItems='center'>
                  <Avatar circular size='$4'>
                    {/* <Avatar.Image
                    source={{ uri: orderDetails.customer.avatar || '' }}
                  /> */}
                    <Avatar.Fallback>
                      <FiUser size={24} />
                    </Avatar.Fallback>
                  </Avatar>
                  <YStack>
                    <Text fontSize='$4' fontWeight='600'>
                      {orderDetails.customer.name}{' '}
                    </Text>
                    <Text color='$gray10'>{orderDetails.customer.email}</Text>
                    {orderDetails.customer.phone && (
                      <Text color='$gray10'>{orderDetails.customer.phone}</Text>
                    )}
                  </YStack>
                </XStack>
              </Card>

              {/* Actions Section */}
              <YStack space='$3'>
                <Button
                  icon={<FiPackage />}
                  size='$4'
                  onPress={handleTrackOrder}
                >
                  Track Order
                </Button>

                <Button
                  disabled={isGeneratingPdf}
                  icon={isGeneratingPdf ? <Spinner /> : <FiPrinter />}
                  variant='outlined'
                  size='$4'
                  onPress={handlePrintReceipt}
                >
                  {isGeneratingPdf ? 'Generating...' : 'Print Receipt'}
                </Button>

                <Button
                  icon={<FiHome />}
                  variant='outlined'
                  size='$4'
                  onPress={handleGoHome}
                >
                  Continue Shopping
                </Button>
              </YStack>
            </YStack>

            {/* Right column - Order Summary */}
            <YStack flex={1} minWidth={320} space='$4'>
              <Card
                bordered
                padding='$4'
                space='$3'
                backgroundColor='$background'
              >
                <Text fontSize='$6' fontWeight='bold'>
                  Order Summary
                </Text>
                <Separator marginVertical='$2' />

                {/* Order items */}
                <ScrollView maxHeight={400}>
                  <YStack space='$3' marginTop='$2'>
                    {orderDetails.items.map((item, index) => (
                      <Card
                        key={item._id || index}
                        padding='$3'
                        backgroundColor='$gray2'
                      >
                        <XStack space='$3' alignItems='center'>
                          <YStack
                            width={80}
                            height={80}
                            backgroundColor='$gray4'
                            alignItems='center'
                            justifyContent='center'
                            borderRadius='$3'
                          >
                            {item.product.thumbnail ? (
                              <RenderDriveFile
                                style={{
                                  width: '64px',
                                  height: '64px',
                                  objectFit: 'cover',
                                  borderRadius: '4px',
                                }}
                                file={item.product.thumbnail as File}
                              />
                            ) : (
                              <FiPackage size={32} />
                            )}
                          </YStack>

                          <YStack flex={1} space='$1'>
                            <Text
                              onPress={() =>
                                router.push(
                                  `/product-details/${item.product._id}?name=${item.product.name}&description=${item.product.description}&variant=${item.variant}`
                                )
                              }
                              hoverStyle={{
                                color: '$linkColor',
                                cursor: 'pointer',
                              }}
                              fontWeight='bold'
                              fontSize='$4'
                            >
                              {item.product.name}
                            </Text>
                            <Text color='$gray10' fontSize='$3'>
                              SKU: {item.sku}
                            </Text>
                            <Text color='$gray10' fontSize='$3'>
                              Variant: {item.variantName}
                            </Text>
                            <XStack
                              justifyContent='space-between'
                              alignItems='center'
                            >
                              <Text color='$gray10'>
                                Qty: {item.quantityOrdered}
                              </Text>
                              <View
                                backgroundColor={getStatusColor(item.status)}
                                paddingHorizontal='$2'
                                paddingVertical='$1'
                              >
                                <Text
                                  color='white'
                                  fontSize='$1'
                                  textTransform='uppercase'
                                >
                                  {item.status}
                                </Text>
                              </View>
                            </XStack>
                            {item.isMadeOnDemand && (
                              <XStack alignItems='center' space='$1'>
                                <FiClock size={12} />
                                <Text fontSize='$2' color='$orange10'>
                                  Made on Demand
                                </Text>
                              </XStack>
                            )}
                          </YStack>

                          <YStack alignItems='flex-end' space='$1'>
                            {item.totalDiscount > 0 && (
                              <Text
                                fontSize='$3'
                                color='$gray10'
                                textDecorationLine='line-through'
                              >
                                <PriceFormatter
                                  value={
                                    item.originalPrice * item.quantityOrdered
                                  }
                                />
                              </Text>
                            )}
                            <Text fontWeight='bold' fontSize='$4'>
                              <PriceFormatter value={item.totalAmount} />
                            </Text>
                            {item.totalDiscount > 0 && (
                              <Text fontSize='$2' color='$green10'>
                                - <PriceFormatter value={item.totalDiscount} />
                              </Text>
                            )}
                          </YStack>
                        </XStack>
                      </Card>
                    ))}
                  </YStack>
                </ScrollView>

                <Separator marginVertical='$3' />

                {/* Totals */}
                <YStack space='$2'>
                  <XStack justifyContent='space-between'>
                    <Text>Subtotal</Text>
                    <Text>
                      <PriceFormatter value={orderDetails.subtotal} />
                    </Text>
                  </XStack>

                  {orderDetails.itemDiscounts > 0 && (
                    <XStack justifyContent='space-between'>
                      <Text color='$green10'>Item Discounts</Text>
                      <Text color='$green10'>
                        -<PriceFormatter value={orderDetails.itemDiscounts} />
                      </Text>
                    </XStack>
                  )}

                  {orderDetails.couponDiscount > 0 && (
                    <XStack justifyContent='space-between'>
                      <Text color='$green10'>Coupon Discount</Text>
                      <Text color='$green10'>
                        -<PriceFormatter value={orderDetails.couponDiscount} />
                      </Text>
                    </XStack>
                  )}

                  <XStack justifyContent='space-between'>
                    <Text>Delivery Charge</Text>
                    <Text>
                      <PriceFormatter value={orderDetails.deliveryCharge} />
                    </Text>
                  </XStack>

                  {orderDetails.serviceCharge > 0 && (
                    <XStack justifyContent='space-between'>
                      <Text>Service Charge</Text>
                      <Text>
                        <PriceFormatter value={orderDetails.serviceCharge} />
                      </Text>
                    </XStack>
                  )}

                  <XStack justifyContent='space-between'>
                    <Text>Tax</Text>
                    <Text>
                      <PriceFormatter value={orderDetails.taxAmount} />
                    </Text>
                  </XStack>

                  <Separator marginVertical='$2' />

                  <XStack justifyContent='space-between' alignItems='center'>
                    <Text fontWeight='bold' fontSize='$5'>
                      Total
                    </Text>
                    <Text fontWeight='bold' fontSize='$6' color='$green10'>
                      <PriceFormatter value={orderDetails.totalAmount} />
                    </Text>
                  </XStack>

                  {orderDetails.totalDiscount > 0 && (
                    <XStack justifyContent='space-between'>
                      <Text fontSize='$3' color='$green10'>
                        Total Savings
                      </Text>
                      <Text fontSize='$3' color='$green10' fontWeight='600'>
                        <PriceFormatter value={orderDetails.totalDiscount} />
                      </Text>
                    </XStack>
                  )}
                </YStack>
              </Card>

              {/* Help section */}
              <Card
                bordered
                padding='$4'
                space='$3'
                backgroundColor='$background'
              >
                <XStack alignItems='center' space='$2'>
                  <FiInfo size={20} color='$blue9' />
                  <Text fontSize='$5' fontWeight='bold'>
                    Need Help?
                  </Text>
                </XStack>
                <Text color='$gray10' marginTop='$2'>
                  If you have any questions about your order, feel free to
                  contact our customer support team.
                </Text>
                <Button
                  icon={<FiMail />}
                  variant='outlined'
                  size='$3'
                  marginTop='$3'
                  onPress={() => router.push('/contact')}
                >
                  Contact Support
                </Button>
              </Card>

              {/* Order Notes */}
              {orderDetails.notes && (
                <Card
                  bordered
                  padding='$4'
                  space='$3'
                  backgroundColor='$background'
                >
                  <Text fontSize='$5' fontWeight='bold'>
                    Order Notes
                  </Text>
                  <Text color='$gray11' lineHeight='$1'>
                    {orderDetails.notes}
                  </Text>
                </Card>
              )}
            </YStack>
          </XStack>

          {/* Thank you message */}
          <Card
            bordered
            padding='$6'
            marginTop='$6'
            backgroundColor='$blue2'
            borderColor='$blue6'
          >
            <YStack alignItems='center' space='$3'>
              <FiCheckCircle size={32} color='$blue9' />
              <Text fontSize='$6' fontWeight='bold' textAlign='center'>
                Thank You For Your Purchase!
              </Text>
              <Text
                textAlign='center'
                color='$gray11'
                fontSize='$4'
                maxWidth={600}
              >
                We appreciate your business and hope you enjoy your items.
                You'll receive updates about your order status via email and
                SMS.
              </Text>
            </YStack>
          </Card>
        </YStack>
      </ScrollView>
    </div>
  );
};

export default OrderConfirmationPage;
