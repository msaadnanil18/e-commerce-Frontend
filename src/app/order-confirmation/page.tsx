'use client';
import React, { useState } from 'react';

import {
  Stack,
  XStack,
  YStack,
  Button,
  Text,
  Separator,
  ScrollView,
  Card,
  Spinner,
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
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import { ServiceErrorManager } from '@/helpers/service';
import { GenerateCustomerOrderBillService } from '@/services/order';
import { downloadPDF } from '@/helpers/PdfDownload';

const OrderConfirmationPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const generatePdf = async () => {
    setIsLoading(true);
    await ServiceErrorManager(GenerateCustomerOrderBillService(), {
      failureMessage: 'PDF is corrupted. Please try again',
    })
      .then(([, data]) => downloadPDF(data))
      .finally(() => setIsLoading(false));
  };

  const orderData = {
    orderNumber: '0RD12345678',
    orderDate: 'March 19, 2025',
    estimatedDelivery: 'March 22-24, 2025',
    paymentMethod: 'Visa •••• 1234',
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'United States',
    },
    items: [
      { id: 1, name: 'Motora mobile phone', price: 99.99, quantity: 1 },
      { id: 2, name: 'LG monitor', price: 19.99, quantity: 2 },
    ],
    subtotal: 139.97,
    shipping: 5.99,
    tax: 11.2,
    total: 157.16,
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleTrackOrder = () => {
    router.push(`/order-tracking/${orderData.orderNumber}`);
  };

  const handlePrintReceipt = async () => {
    await generatePdf();
  };

  return (
    <ScrollView>
      <Navbar />
      <YStack padding='$4' space='$4' maxWidth={800} marginHorizontal='auto'>
        {/* Confirmation Header */}
        <YStack alignItems='center' space='$2' marginVertical='$6'>
          <XStack
            backgroundColor='$green3'
            padding='$3'
            borderRadius='$3'
            marginBottom='$2'
          >
            <FiCheckCircle size={40} color='green' />
          </XStack>
          <Text fontSize='$7' fontWeight='bold' textAlign='center'>
            Order Confirmed!
          </Text>
          <Text fontSize='$4' textAlign='center' color='$gray11'>
            Your order #{orderData.orderNumber} has been placed successfully.
          </Text>
          <Text fontSize='$3' textAlign='center' color='$gray10'>
            A confirmation email has been sent to your email address.
          </Text>
        </YStack>

        {/* Main Content */}
        <XStack flexWrap='wrap' gap='$4'>
          {/* Left column - Order Details */}
          <YStack flex={1} minWidth={320} space='$4'>
            {/* Order Info Section */}
            <Card bordered padding='$4' space='$3'>
              <Text fontSize='$5' fontWeight='bold'>
                Order Information
              </Text>
              <Separator marginVertical='$2' />

              <YStack space='$3'>
                <XStack space='$2' alignItems='center'>
                  <FiCalendar size={16} />
                  <YStack>
                    <Text fontSize='$2' color='$gray10'>
                      ORDER DATE
                    </Text>
                    <Text>{orderData.orderDate}</Text>
                  </YStack>
                </XStack>

                <XStack space='$2' alignItems='center'>
                  <FiPackage size={16} />
                  <YStack>
                    <Text fontSize='$2' color='$gray10'>
                      ESTIMATED DELIVERY
                    </Text>
                    <Text>{orderData.estimatedDelivery}</Text>
                  </YStack>
                </XStack>

                <XStack space='$2' alignItems='flex-start'>
                  <FiMapPin size={16} />
                  <YStack>
                    <Text fontSize='$2' color='$gray10'>
                      SHIPPING ADDRESS
                    </Text>
                    <Text>{orderData.shippingAddress.name}</Text>
                    <Text>{orderData.shippingAddress.street}</Text>
                    <Text>
                      {orderData.shippingAddress.city},{' '}
                      {orderData.shippingAddress.state}{' '}
                      {orderData.shippingAddress.zip}
                    </Text>
                    <Text>{orderData.shippingAddress.country}</Text>
                  </YStack>
                </XStack>

                <XStack space='$2' alignItems='center'>
                  <FiCreditCard size={16} />
                  <YStack>
                    <Text fontSize='$2' color='$gray10'>
                      PAYMENT METHOD
                    </Text>
                    <Text>{orderData.paymentMethod}</Text>
                  </YStack>
                </XStack>
              </YStack>
            </Card>

            {/* Actions Section */}
            <YStack space='$3'>
              <Button
                icon={<FiPackage />}
                marginTop='$2'
                size='$4'
                onPress={handleTrackOrder}
              >
                Track Order
              </Button>

              <Button
                disabled={isLoading}
                icon={isLoading ? <Spinner /> : <FiPrinter />}
                variant='outlined'
                size='$4'
                onPress={handlePrintReceipt}
              >
                Print Receipt
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
            <Card bordered padding='$4' space='$3'>
              <Text fontSize='$5' fontWeight='bold'>
                Order Summary
              </Text>
              <Separator marginVertical='$2' />

              {/* Cart items */}
              <YStack space='$3' marginTop='$2'>
                {orderData.items.map((item) => (
                  <XStack key={item.id} space='$3'>
                    {/* Item thumbnail placeholder - in real app, use actual images */}
                    <YStack
                      width={60}
                      height={60}
                      backgroundColor='$gray4'
                      alignItems='center'
                      justifyContent='center'
                      borderRadius='$2'
                    >
                      <FiPackage size={24} />
                    </YStack>

                    <YStack flex={1} justifyContent='space-between'>
                      <Text fontWeight='bold'>{item.name}</Text>
                      <Text color='$gray10'>Quantity: {item.quantity}</Text>
                    </YStack>

                    <Text fontWeight='bold'>
                      {(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </XStack>
                ))}
              </YStack>

              <Separator marginVertical='$3' />

              {/* Totals */}
              <YStack space='$2'>
                <XStack justifyContent='space-between'>
                  <Text>Subtotal</Text>
                  <Text>{orderData.subtotal.toFixed(2)}</Text>
                </XStack>
                <XStack justifyContent='space-between'>
                  <Text>Shipping</Text>
                  <Text>{orderData.shipping.toFixed(2)}</Text>
                </XStack>
                <XStack justifyContent='space-between'>
                  <Text>Tax</Text>
                  <Text>{orderData.tax.toFixed(2)}</Text>
                </XStack>

                <Separator marginVertical='$2' />

                <XStack justifyContent='space-between'>
                  <Text fontWeight='bold'>Total</Text>
                  <Text fontWeight='bold' fontSize='$5'>
                    {orderData.total.toFixed(2)}
                  </Text>
                </XStack>
              </YStack>
            </Card>

            {/* Help section */}
            <Card bordered padding='$4' space='$3'>
              <Text fontSize='$4' fontWeight='bold'>
                Need Help?
              </Text>
              <Text color='$gray10' marginTop='$2'>
                If you have any questions about your order, feel free to contact
                our customer support.
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
          </YStack>
        </XStack>

        {/* Thank you message */}
        <YStack alignItems='center' padding='$4' marginTop='$4'>
          <Text fontSize='$4' fontWeight='bold'>
            Thank You For Your Purchase!
          </Text>
          <Text textAlign='center' color='$gray10' marginTop='$2'>
            We appreciate your business and hope you enjoy your items.
          </Text>
        </YStack>
      </YStack>
    </ScrollView>
  );
};

export default OrderConfirmationPage;
