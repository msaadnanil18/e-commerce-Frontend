'use client';
import React, { useState, useEffect, FC } from 'react';
import {
  XStack,
  YStack,
  Text,
  ScrollView,
  Card,
  Button,
  Spinner,
  Separator,
  H3,
  useTheme,
  Sheet,
  Image,
  Input,
  XGroup,
  H6,
  View,
} from 'tamagui';
import {
  FiShoppingBag,
  FiTruck,
  FiPackage,
  FiClock,
  FiCheck,
  FiX,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronRight,
} from 'react-icons/fi';
import dayjs from 'dayjs';
import { ServiceErrorManager } from '@/helpers/service';
import { GetOrdersByCustomerService } from '@/services/order';
import { IOrder } from '@/types/order';
import RenderDriveFile from '@/components/appComponets/fileupload/RenderDriveFile';
import PriceFormatter from '@/components/appComponets/PriceFormatter/PriceFormatter';
import { GiShoppingBag } from 'react-icons/gi';

// Define types for our components
interface OrderStatusBadgeProps {
  status: string;
}

interface PaymentStatusBadgeProps {
  status: string;
}

interface OrderItemProps {
  item: IOrder;
}

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    status: string;
    dateFrom: Date | null;
    dateTo: Date | null;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      status: string;
      dateFrom: Date | null;
      dateTo: Date | null;
    }>
  >;
}

// Order status badges with appropriate colors
const OrderStatusBadge: FC<OrderStatusBadgeProps> = ({ status }) => {
  let color = '';
  let icon = null;

  switch (status) {
    case 'pending':
      color = 'orange';
      icon = <FiClock size={14} />;
      break;
    case 'accepted':
      color = 'blue';
      icon = <FiCheck size={14} />;
      break;
    case 'shipped':
      color = 'purple';
      icon = <FiTruck size={14} />;
      break;
    case 'delivered':
      color = 'green';
      icon = <FiPackage size={14} />;
      break;
    case 'canceled':
    case 'rejected':
      color = 'red';
      icon = <FiX size={14} />;
      break;
    default:
      color = 'gray';
  }

  return (
    <XStack alignItems='center' space='sm'>
      {icon}
      <Text color='white' fontWeight='bold' textTransform='capitalize'>
        {status}
      </Text>
    </XStack>
  );
};

// Payment status badge
const PaymentStatusBadge: FC<PaymentStatusBadgeProps> = ({ status }) => {
  let color = '';

  switch (status) {
    case 'paid':
      color = 'green';
      break;
    case 'partial':
      color = 'yellow';
      break;
    case 'pending':
      color = 'red';
      break;
    default:
      color = 'gray';
  }

  return (
    <Text color='white' fontWeight='bold' textTransform='capitalize'>
      {status}
    </Text>
  );
};

// Order Item Component
const OrderItem: FC<OrderItemProps> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card bordered size='$2' marginVertical='$2'>
      <Card.Header padded>
        <XStack
          justifyContent='space-between'
          alignItems='center'
          flexWrap='wrap'
        >
          <XStack space='$2' alignItems='center'>
            <GiShoppingBag size={20} />
            <Text fontSize='$4' fontWeight='bold'>
              #{item.orderNumber}
            </Text>
          </XStack>
          <XStack space='sm'>
            <OrderStatusBadge status={'pending'} />
            <PaymentStatusBadge status={item.paymentStatus} />
          </XStack>
        </XStack>
      </Card.Header>

      <Separator />

      <Card.Footer padded>
        <XStack
          justifyContent='space-between'
          alignItems='center'
          flexWrap='wrap'
          space='$3'
        >
          <Text color='$gray10'>
            {dayjs(item.createdAt).format('MMM DD, YYYY')}
          </Text>
          <XStack space='$5' alignItems='center'>
            <Text fontWeight='bold'>
              <PriceFormatter value={item.totalAmount} />
            </Text>
            <Button
              unstyled
              padding={10}
              size='$3'
              chromeless
              onPress={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <Text
                  hoverStyle={{
                    color: '$linkColor',
                  }}
                  fontSize={12}
                >
                  <XStack>
                    <FiChevronDown size={18} />
                    Hide Details
                  </XStack>
                </Text>
              ) : (
                <Text
                  hoverStyle={{
                    color: '$linkColor',
                  }}
                  fontSize={12}
                >
                  <XStack>
                    <FiChevronRight size={18} />
                    View Details
                  </XStack>
                </Text>
              )}
            </Button>
          </XStack>
        </XStack>
      </Card.Footer>

      {expanded && (
        <YStack padding='$4' space='md'>
          <Separator />
          <Text fontWeight='bold'>Order Items ({item.items.length})</Text>

          {item.items.map((orderItem, idx) => (
            <Card key={idx} bordered size='$1' margin='$1'>
              <XStack space='md' padding='$3' alignItems='center'>
                <RenderDriveFile
                  style={{
                    width: '64px',
                    height: '64px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                  file={orderItem.product.thumbnail}
                />

                <YStack flex={1} space='sm'>
                  <Text fontWeight='bold'>
                    {orderItem.product?.name || 'Product Name'}
                  </Text>
                  <XStack justifyContent='space-between'>
                    <Text>
                      {orderItem.quantityOrdered} × {orderItem.price}
                    </Text>
                    <Text fontWeight='bold'>
                      <PriceFormatter
                        value={orderItem.price * orderItem.quantityOrdered}
                      />
                    </Text>
                  </XStack>
                  <OrderStatusBadge status={orderItem.status} />
                </YStack>
              </XStack>
            </Card>
          ))}

          <Separator />

          <YStack space='sm'>
            <XStack justifyContent='space-between'>
              <Text>Subtotal</Text>
              <Text>
                <PriceFormatter
                  value={
                    item.totalAmount -
                    item.taxAmount -
                    item.deliveryCharge -
                    item.serviceCharge
                  }
                />
              </Text>
            </XStack>

            <XStack justifyContent='space-between'>
              <Text>Tax</Text>
              <Text>
                <PriceFormatter value={item.taxAmount} />
              </Text>
            </XStack>

            <XStack justifyContent='space-between'>
              <Text>Delivery Fee</Text>
              <Text>
                <PriceFormatter value={item.deliveryCharge} />
              </Text>
            </XStack>

            <XStack justifyContent='space-between'>
              <Text>Service Charge</Text>
              <Text>
                <PriceFormatter value={item.serviceCharge} />
              </Text>
            </XStack>

            <Separator />

            <XStack justifyContent='space-between'>
              <Text fontWeight='bold'>Total</Text>
              <Text fontWeight='bold'>
                <PriceFormatter value={item.totalAmount} />
              </Text>
            </XStack>
          </YStack>

          <Separator />

          <XStack justifyContent='space-between' flexWrap='wrap'>
            <Button
              size='$3'
              icon={<FiTruck />}
              disabled={
                !['shipped', 'delivered'].includes((item as any)?.overallStatus)
              }
            >
              Track Order
            </Button>

            <Button
              size='$3'
              variant='outlined'
              color='$red10'
              disabled={
                !['pending', 'accepted'].includes((item as any).overallStatus)
              }
            >
              Cancel Order
            </Button>
          </XStack>
        </YStack>
      )}
    </Card>
  );
};

const FilterSheet: FC<FilterSheetProps> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  return (
    <YStack>
      <H6>Filter Orders</H6>
      <YStack space='$1.5' marginTop='$1'>
        <Text fontWeight='bold'>Order Status</Text>
        <YStack space='sm'>
          {[
            'all',
            'pending',
            'accepted',
            'shipped',
            'delivered',
            'canceled',
          ].map((status) => (
            <Button
              key={status}
              size='$3'
              margin='$1'
              backgroundColor={localFilters.status === status ? '$primary' : ''}
              variant={localFilters.status !== status ? 'outlined' : undefined}
              onPress={() => setLocalFilters({ ...localFilters, status })}
            >
              {status === 'all'
                ? 'All'
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </YStack>

        <Separator marginVertical='$1.5' />

        <Text fontWeight='bold'>Date Range</Text>
        <YStack space='$1.5'>
          <Text>From</Text>
          <Input size='$3' placeholder='MM/DD/YYYY' />
          <Text marginTop='$1.5'>To</Text>
          <Input size='$3' placeholder='MM/DD/YYYY' />
        </YStack>

        <YStack space='$2' marginTop='$2'>
          <Button
            size='$3'
            variant='outlined'
            onPress={() =>
              setLocalFilters({
                status: 'all',
                dateFrom: null,
                dateTo: null,
              })
            }
          >
            Reset Filters
          </Button>
          <Button
            size='$3'
            backgroundColor='$primary'
            onPress={() => {
              setFilters(localFilters);
              onClose();
            }}
          >
            Apply Filters
          </Button>
        </YStack>
      </YStack>
    </YStack>
  );
};

const OrdersList: FC = () => {
  const [orders, setOrders] = useState<Array<IOrder>>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const theme = useTheme();

  const fetchOrderList = () => {
    setLoading(true);
    ServiceErrorManager(
      GetOrdersByCustomerService({
        data: {
          quary: {
            search: searchQuery,
          },
        },
      }),
      {}
    )
      .then(([_, data]) => {
        setOrders(data.docs);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery === '' ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filters.status === 'all' ||
      (order as any).overallStatus === filters.status;

    return matchesSearch && matchesStatus;
  });

  return (
    <YStack padding='$5' flex={1}>
      <XStack space='$5'>
        <FilterSheet
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          setFilters={setFilters}
        />
        <ScrollView>
          <H6>My Orders</H6>
          <XStack marginTop='$4' space='$5'>
            <XStack width='100%'>
              <Input
                flex={1}
                size='$3'
                placeholder='Search by order number...'
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </XStack>
          </XStack>

          {loading ? (
            <YStack
              alignItems='center'
              justifyContent='center'
              flex={1}
              padding='$8'
            >
              <Spinner size='large' color='$blue10' />
              <Text color='$gray10' marginTop='$4'>
                Loading your orders...
              </Text>
            </YStack>
          ) : filteredOrders.length > 0 ? (
            <YStack space='md'>
              {filteredOrders.map((order) => (
                <OrderItem key={order._id} item={order} />
              ))}
            </YStack>
          ) : (
            <YStack
              alignItems='center'
              justifyContent='center'
              flex={1}
              padding='$8'
            >
              <FiShoppingBag size={60} color={theme.gray8.get()} />
              <Text color='$gray10' marginTop='$4' textAlign='center'>
                No orders found
                {searchQuery ? ` matching "${searchQuery}"` : ''}
                {filters.status !== 'all'
                  ? ` with status "${filters.status}"`
                  : ''}
              </Text>
              {(searchQuery || filters.status !== 'all') && (
                <Button
                  marginTop='$4'
                  variant='outlined'
                  onPress={() => {
                    setSearchQuery('');
                    setFilters({ ...filters, status: 'all' });
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </YStack>
          )}
        </ScrollView>
      </XStack>
    </YStack>
  );
};

export default OrdersList;
