'use client';
import { IOrder, IOrderItem } from '@/types/order';
import React, { useState, useEffect, FC } from 'react';
import {
  XStack,
  YStack,
  Text,
  Card,
  Button,
  Separator,
  Theme,
  ScrollView,
  Input,
  Avatar,
  H4,
  Spinner,
  H6,
} from 'tamagui';
import StatusBadge, { OrderStatus } from './StatusBadge';
import PaymentStatusBadge from './PaymentStatusBadge';
import dayjs from 'dayjs';
import { FiPackage, FiPrinter, FiEdit, FiCheck } from 'react-icons/fi';
import PriceFormatter from '@/components/appComponets/PriceFormatter/PriceFormatter';
import AsyncSelect from '@/components/appComponets/select/AsyncSelect';
import { head, startCase, truncate } from 'lodash-es';
import { ServiceErrorManager } from '@/helpers/service';
import { GenerateCustomerOrderBillService } from '@/services/order';
import { downloadPDF } from '@/helpers/PdfDownload';

export type OnStatusUpdateProps = {
  order: string;
  item: string;
  status: OrderStatus;
  trackingNumber?: string;
};

interface ExpandedOrderItem extends IOrderItem {
  isEditing?: boolean;
  newStatus?: OrderStatus;
  newTrackingNumber?: string;
  isUpdating?: boolean;
}

const OrderDetails: FC<{
  order: IOrder | null;
  onClose: () => void;
  onStatusUpdate: (r: OnStatusUpdateProps) => Promise<void>;
}> = ({ order, onClose, onStatusUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [orderItems, setOrderItems] = useState<ExpandedOrderItem[]>([]);

  useEffect(() => {
    if (order && order.items.length > 0) {
      setOrderItems(
        order.items.map((item) => ({
          ...item,
          isEditing: false,
          newStatus: item.status as OrderStatus,
          newTrackingNumber: item.trackingNumber || '',
          isUpdating: false,
        }))
      );
    }
  }, [order]);

  if (!order) return null;

  const toggleItemEdit = (index: number) => {
    setOrderItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        isEditing: !updated[index].isEditing,
      };
      return updated;
    });
  };

  const updateItemField = (index: number, field: string, value: string) => {
    setOrderItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const handleUpdateItem = async (index: number) => {
    const item = orderItems[index];
    if (!item.newStatus || !order) return;

    setOrderItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        isUpdating: true,
      };
      return updated;
    });

    await onStatusUpdate({
      order: order._id,
      item: (orderItems?.[index] as any)?._id,
      status: item.newStatus as OrderStatus,
      trackingNumber: item.trackingNumber,
    });

    setOrderItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        status: item.newStatus as OrderStatus,
        trackingNumber:
          item.newStatus === 'shipped'
            ? item.newTrackingNumber || ''
            : item.trackingNumber || '',
        isUpdating: false,
        isEditing: false,
      };
      return updated;
    });
  };

  const generatePdf = async () => {
    setIsLoading(true);
    await ServiceErrorManager(GenerateCustomerOrderBillService(), {
      failureMessage: 'PDF is corrupted. Please try again',
    })
      .then(([, data]) => downloadPDF(data))
      .finally(() => setIsLoading(false));
  };

  const isItemDisabled = (item: ExpandedOrderItem) =>
    item.status === 'canceled' || item.status === 'delivered';

  return (
    <YStack padding='$4' space='$4'>
      <ScrollView maxHeight={380}>
        <XStack justifyContent='space-between' alignItems='center'>
          <H6>Order #{order.orderNumber}</H6>
        </XStack>

        <Card bordered padding='$4'>
          <YStack space='$4'>
            <XStack space='$3' alignItems='center'>
              <Avatar circular size='$5' backgroundColor='$blue5'>
                <Text color='$blue11' fontSize='$4'>
                  {head(startCase(order.customer as any))}
                </Text>
              </Avatar>
              <YStack>
                <Text fontSize='$5' fontWeight='bold'>
                  {order.customer}
                </Text>
                <Text fontSize='$3' color='$gray10'>
                  {(order as any)?.customerDetails.email}
                </Text>
              </YStack>
            </XStack>

            <XStack flexWrap='wrap' gap='$2'>
              <PaymentStatusBadge status={order.paymentStatus} />
              <Theme>
                <Text fontSize='$3' fontWeight='500' color='$color11'>
                  {dayjs(order.createdAt).format('DD/MM/YYYY')}
                </Text>
              </Theme>
            </XStack>

            <Separator />

            <YStack space='$3'>
              <H6>Shipping Address</H6>
              <Card bordered padding='$3' backgroundColor='$gray2'>
                <YStack space='$1'>
                  <Text fontSize='$3'>{order.shippingAddress?.street}</Text>
                  <Text fontSize='$3'>
                    {order.shippingAddress.city}, {order.shippingAddress?.state}{' '}
                    {order.shippingAddress.postalCode}
                  </Text>
                  <Text fontSize='$3'>{order.shippingAddress.country}</Text>
                </YStack>
              </Card>
            </YStack>

            <Separator />

            <YStack space='$3'>
              <H6>Order Items</H6>
              <YStack space='$2'>
                {orderItems.map((item, index) => (
                  <Card key={index} bordered padding='$3'>
                    <YStack space='$3'>
                      <XStack
                        justifyContent='space-between'
                        alignItems='center'
                      >
                        <XStack space='$3' alignItems='center'>
                          <Avatar circular size='$4' backgroundColor='$gray5'>
                            <FiPackage size={16} />
                          </Avatar>
                          <YStack>
                            <Text
                              fontSize='$4'
                              numberOfLines={2}
                              fontWeight='500'
                            >
                              {truncate(item.product.name, { length: 100 }) ||
                                'Product Name'}
                            </Text>
                            <XStack space='$2' alignItems='center'>
                              <Text fontSize='$3' color='$gray10'>
                                Qty: {item.quantityOrdered}
                              </Text>
                              {item.variant && (
                                <Text fontSize='$3' color='$gray10'>
                                  Variant:{' '}
                                  {item.variant.variantName || 'Default'}
                                </Text>
                              )}
                            </XStack>
                          </YStack>
                        </XStack>
                        <YStack alignItems='flex-end'>
                          <Text fontSize='$4' fontWeight='bold'>
                            <PriceFormatter value={item.price} />
                          </Text>
                          <StatusBadge status={item.status} />
                        </YStack>
                      </XStack>

                      {!isItemDisabled(item) && (
                        <XStack justifyContent='flex-end'>
                          {!item.isEditing ? (
                            <Button
                              size='$3'
                              icon={FiEdit}
                              variant='outlined'
                              onPress={() => toggleItemEdit(index)}
                            >
                              Update
                            </Button>
                          ) : (
                            <YStack space='$2' width='100%'>
                              <Separator />
                              <Text fontSize='$3' fontWeight='500'>
                                Status
                              </Text>
                              <AsyncSelect
                                size='$3'
                                options={[
                                  { value: 'pending', label: 'Pending' },
                                  { value: 'accepted', label: 'Accepted' },
                                  { value: 'shipped', label: 'Shipped' },
                                  { value: 'delivered', label: 'Delivered' },
                                  { value: 'canceled', label: 'Canceled' },
                                ]}
                                value={item.newStatus}
                                onChange={(value) =>
                                  updateItemField(
                                    index,
                                    'newStatus',
                                    value as string
                                  )
                                }
                                placeholder='Select status'
                              />

                              {item.newStatus === 'shipped' && (
                                <>
                                  <Text
                                    fontSize='$3'
                                    fontWeight='500'
                                    marginTop='$2'
                                  >
                                    Tracking Number
                                  </Text>
                                  <Input
                                    value={item.newTrackingNumber}
                                    onChange={(e) =>
                                      updateItemField(
                                        index,
                                        'newTrackingNumber',
                                        e.nativeEvent.text
                                      )
                                    }
                                    placeholder='Enter tracking number'
                                  />
                                </>
                              )}

                              <XStack
                                space='$2'
                                justifyContent='flex-end'
                                marginTop='$2'
                              >
                                <Button
                                  size='$3'
                                  variant='outlined'
                                  onPress={() => toggleItemEdit(index)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size='$3'
                                  icon={item.isUpdating ? Spinner : FiCheck}
                                  backgroundColor='$primary'
                                  disabled={!item.newStatus || item.isUpdating}
                                  onPress={() => handleUpdateItem(index)}
                                >
                                  {item.isUpdating ? 'Updating...' : 'Save'}
                                </Button>
                              </XStack>
                            </YStack>
                          )}
                        </XStack>
                      )}
                    </YStack>
                  </Card>
                ))}
              </YStack>
            </YStack>

            <Separator />

            <YStack space='$3'>
              <H6>Order Summary</H6>
              <Card bordered padding='$3' backgroundColor='$gray2'>
                <YStack space='$2'>
                  <XStack justifyContent='space-between'>
                    <Text>Subtotal:</Text>
                    <Text>
                      <PriceFormatter value={order.totalAmount} />
                    </Text>
                  </XStack>
                  <XStack justifyContent='space-between'>
                    <Text>Tax:</Text>
                    <Text>
                      <PriceFormatter value={order.taxAmount} />
                    </Text>
                  </XStack>
                  <XStack justifyContent='space-between'>
                    <Text>Delivery Charge:</Text>
                    <Text>
                      <PriceFormatter value={order.deliveryCharge} />
                    </Text>
                  </XStack>
                  <XStack justifyContent='space-between'>
                    <Text>Service Charge:</Text>
                    <Text>
                      <PriceFormatter value={order.serviceCharge} />
                    </Text>
                  </XStack>
                  {order.commissionDue && (
                    <XStack justifyContent='space-between'>
                      <Text>Commission Due:</Text>
                      <Text>
                        <PriceFormatter value={order.commissionDue} />
                      </Text>
                    </XStack>
                  )}
                  <Separator />
                  <XStack justifyContent='space-between'>
                    <Text fontSize='$4' fontWeight='bold'>
                      Total
                    </Text>
                    <Text fontSize='$4' fontWeight='bold'>
                      <PriceFormatter
                        value={
                          order.totalAmount +
                          order.taxAmount +
                          order.deliveryCharge +
                          order.serviceCharge
                        }
                      />
                    </Text>
                  </XStack>
                </YStack>
              </Card>
            </YStack>
          </YStack>
        </Card>

        <XStack space='$3' marginTop='$3' justifyContent='center'>
          <Button
            onPress={generatePdf}
            size='$3'
            variant='outlined'
            // iconAfter={FiPrinter}
            icon={isLoading ? <Spinner /> : <FiPrinter />}
          >
            Print Invoice
          </Button>
          <Button size='$3' variant='outlined' onPress={onClose}>
            Close
          </Button>
        </XStack>
      </ScrollView>
    </YStack>
  );
};

export default OrderDetails;
