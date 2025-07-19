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
  useTheme,
  Input,
  H6,
  Sheet,
} from 'tamagui';
import {
  FiShoppingBag,
  FiTruck,
  FiPackage,
  FiClock,
  FiCheck,
  FiX,
  FiChevronDown,
  FiChevronRight,
  FiFilter,
} from 'react-icons/fi';
import dayjs from 'dayjs';
import { ServiceErrorManager } from '@/helpers/service';
import { ListOrdersByCustomerService } from '@/services/order';
import { IOrder } from '@/types/order';
import RenderDriveFile from '@/components/appComponets/fileupload/RenderDriveFile';
import PriceFormatter from '@/components/appComponets/PriceFormatter/PriceFormatter';
import { GiShoppingBag } from 'react-icons/gi';
import { useScreen } from '@/hook/useScreen';

interface OrderStatusBadgeProps {
  status: string;
}

interface PaymentStatusBadgeProps {
  status: string;
}

interface OrderItemProps {
  item: IOrder;
}

interface FilterProps {
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
  onClose?: () => void;
}

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
    <XStack
      alignItems='center'
      space='sm'
      backgroundColor={`$${color}9`}
      paddingHorizontal='$2'
      paddingVertical='$1'
      borderRadius='$2'
    >
      {icon}
      <Text color='white' fontWeight='bold' textTransform='capitalize'>
        {status}
      </Text>
    </XStack>
  );
};

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
    <XStack
      backgroundColor={`$${color}9`}
      paddingHorizontal='$2'
      paddingVertical='$1'
      borderRadius='$2'
    >
      <Text color='white' fontWeight='bold' textTransform='capitalize'>
        {status}
      </Text>
    </XStack>
  );
};

const OrderItem: FC<OrderItemProps> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const screen = useScreen();

  return (
    <Card bordered size='$2' marginVertical='$2'>
      <Card.Header padded>
        <XStack
          justifyContent='space-between'
          alignItems='center'
          flexWrap='wrap'
          gap='$2'
        >
          <XStack space='$2' alignItems='center'>
            <GiShoppingBag size={20} />
            <Text fontSize={screen.sm ? '$3' : '$4'} fontWeight='bold'>
              #{item.orderNumber}
            </Text>
          </XStack>
          <XStack space='sm' flexWrap='wrap' gap='$1'>
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
          gap='$2'
        >
          <Text color='$gray10' fontSize={screen.sm ? '$2' : '$3'}>
            {dayjs(item.createdAt).format('MMM DD, YYYY')}
          </Text>
          <XStack
            space={screen.sm ? '$2' : '$5'}
            alignItems='center'
            flexWrap='wrap'
            gap='$1'
          >
            <Text fontWeight='bold' fontSize={screen.sm ? '$2' : '$3'}>
              <PriceFormatter value={item.totalAmount} />
            </Text>
            <Button
              unstyled
              padding={screen.sm ? 5 : 10}
              size={screen.sm ? '$2' : '$3'}
              chromeless
              onPress={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <Text
                  hoverStyle={{
                    color: '$linkColor',
                  }}
                  fontSize={screen.sm ? 10 : 12}
                >
                  <XStack alignItems='center' space='$1'>
                    <FiChevronDown size={screen.sm ? 14 : 18} />
                    <Text>Hide Details</Text>
                  </XStack>
                </Text>
              ) : (
                <Text
                  hoverStyle={{
                    color: '$linkColor',
                  }}
                  fontSize={screen.sm ? 10 : 12}
                >
                  <XStack alignItems='center' space='$1'>
                    <FiChevronRight size={screen.sm ? 14 : 18} />
                    <Text>View Details</Text>
                  </XStack>
                </Text>
              )}
            </Button>
          </XStack>
        </XStack>
      </Card.Footer>

      {expanded && (
        <YStack padding={screen.sm ? '$2' : '$4'} space='md'>
          <Separator />
          <Text fontWeight='bold'>Order Items ({item.items.length})</Text>

          {item.items.map((orderItem, idx) => (
            <Card key={idx} bordered size='$1' margin='$1'>
              <XStack
                space='md'
                padding={screen.sm ? '$2' : '$3'}
                alignItems='center'
                flexDirection={screen.sm ? 'column' : 'row'}
              >
                <RenderDriveFile
                  style={{
                    width: screen.sm ? '100%' : '64px',
                    height: screen.sm ? '120px' : '64px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                  file={orderItem.product.thumbnail}
                />

                <YStack flex={1} space='sm' width={screen.sm ? '100%' : 'auto'}>
                  <Text fontWeight='bold'>
                    {orderItem.product?.name || 'Product Name'}
                  </Text>
                  <XStack
                    justifyContent='space-between'
                    flexWrap='wrap'
                    gap='$1'
                  >
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

          <XStack
            justifyContent={screen.sm ? 'center' : 'space-between'}
            flexWrap='wrap'
            gap='$2'
          >
            <Button
              size={screen.sm ? '$2' : '$3'}
              icon={<FiTruck size={screen.sm ? 14 : 16} />}
              disabled={
                !['shipped', 'delivered'].includes((item as any)?.overallStatus)
              }
            >
              Track Order
            </Button>

            <Button
              size={screen.sm ? '$2' : '$3'}
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

const FilterContent: FC<FilterProps> = ({ filters, setFilters, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const screen = useScreen();

  return (
    <YStack padding={screen.sm ? '$2' : '$4'} space='$2'>
      <H6>Filter Orders</H6>
      <YStack space='$1.5' marginTop='$1'>
        <Text fontWeight='bold'>Order Status</Text>

        {screen.xs ? (
          <XStack flexWrap='wrap' gap='$1'>
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
                size={screen.sm ? '$2' : '$3'}
                margin='$1'
                backgroundColor={
                  localFilters.status === status ? '$primary' : ''
                }
                variant={
                  localFilters.status !== status ? 'outlined' : undefined
                }
                onPress={() => setLocalFilters({ ...localFilters, status })}
              >
                {status === 'all'
                  ? 'All'
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </XStack>
        ) : (
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
                backgroundColor={
                  localFilters.status === status ? '$primary' : ''
                }
                variant={
                  localFilters.status !== status ? 'outlined' : undefined
                }
                onPress={() => setLocalFilters({ ...localFilters, status })}
              >
                {status === 'all'
                  ? 'All'
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </YStack>
        )}

        <Separator marginVertical='$1.5' />

        <Text fontWeight='bold'>Date Range</Text>
        <YStack space='$1.5'>
          <Text>From</Text>
          <Input size={screen.sm ? '$2' : '$3'} placeholder='MM/DD/YYYY' />
          <Text marginTop='$1.5'>To</Text>
          <Input size={screen.sm ? '$2' : '$3'} placeholder='MM/DD/YYYY' />
        </YStack>

        <YStack space='$2' marginTop='$2'>
          <Button
            size={screen.sm ? '$2' : '$3'}
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
            size={screen.sm ? '$2' : '$3'}
            backgroundColor='$primary'
            onPress={() => {
              setFilters(localFilters);
              if (onClose) onClose();
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
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const theme = useTheme();
  const screen = useScreen();

  const fetchOrderList = () => {
    setLoading(true);
    ServiceErrorManager(
      ListOrdersByCustomerService({
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
    <YStack padding={screen.sm ? '$2' : '$5'} flex={1}>
      <XStack flexDirection={!screen.xs ? 'row' : 'column'} space='$3'>
        {/* Left side - Filter panel (visible only on large screens) */}
        {!screen.xs && (
          <Card width={250} padding='$4' bordered height='fit-content'>
            <FilterContent filters={filters} setFilters={setFilters} />
          </Card>
        )}

        {/* Right side - Orders content */}
        <YStack flex={1}>
          <XStack
            justifyContent='space-between'
            alignItems='center'
            marginBottom='$4'
          >
            <H6>My Orders</H6>

            {/* Filter button for mobile */}
            {!screen.md && (
              <FiFilter onClick={() => setIsFilterSheetOpen(true)} />
            )}
          </XStack>

          {/* Search bar */}
          <XStack marginBottom='$4' space='$2'>
            <Input
              flex={1}
              size={screen.sm ? '$2' : '$3'}
              placeholder='Search by order number...'
              value={searchQuery}
              onChangeText={(text: string) => setSearchQuery(text)}
            />

            {screen.sm && (
              <Button size='$2' onPress={fetchOrderList}>
                Search
              </Button>
            )}
          </XStack>

          {/* Mobile filter sheet */}
          <Sheet
            modal
            open={isFilterSheetOpen}
            onOpenChange={setIsFilterSheetOpen}
            snapPoints={[60]}
            dismissOnSnapToBottom
          >
            <Sheet.Overlay />
            <Sheet.Frame padding='$4'>
              <Sheet.Handle />
              <FilterContent
                filters={filters}
                setFilters={setFilters}
                onClose={() => setIsFilterSheetOpen(false)}
              />
            </Sheet.Frame>
          </Sheet>

          {/* Orders content */}
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
            <ScrollView>
              <YStack space='md'>
                {filteredOrders.map((order) => (
                  <OrderItem key={order._id} item={order} />
                ))}
              </YStack>
            </ScrollView>
          ) : (
            <YStack
              alignItems='center'
              justifyContent='center'
              flex={1}
              padding={screen.sm ? '$4' : '$8'}
            >
              <FiShoppingBag
                size={screen.sm ? 40 : 60}
                color={theme.gray8.get()}
              />
              <Text
                color='$gray10'
                marginTop='$4'
                textAlign='center'
                fontSize={screen.sm ? '$2' : '$3'}
              >
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
                  size={screen.sm ? '$2' : '$3'}
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
        </YStack>
      </XStack>
    </YStack>
  );
};

export default OrdersList;
