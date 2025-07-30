'use client';
import React, { useState, useEffect, FC } from 'react';
import {
  XStack,
  YStack,
  Text,
  ScrollView,
  Button,
  Spinner,
  useTheme,
  Input,
  H6,
} from 'tamagui';
import { FiShoppingBag, FiFilter } from 'react-icons/fi';
import { ServiceErrorManager } from '@/helpers/service';
import { ListOrdersByCustomerService } from '@/services/order';
import { IOrder } from '@/types/order';
import { useScreen } from '@/hook/useScreen';
import TmgDrawer from '@/components/appComponets/Drawer/TmgDrawer';
import FilterContent from './FilterContent';
import OrderItem from './OrderItem';

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
    <XStack flexDirection={!screen.xs ? 'row' : 'column'} space='$4'>
      {!screen.xs && (
        <FilterContent filters={filters} setFilters={setFilters} />
      )}

      <YStack flex={1} width='100%'>
        <ScrollView
          maxHeight='calc(100vh - 74px)'
          contentContainerStyle={{ paddingBottom: 30 }}
          width='100%'
          scrollbarWidth='thin'
        >
          <XStack padding={screen.sm ? '$2' : '$3'} space='$2'>
            <H6>My Orders</H6>

            {screen.xs && (
              <FiFilter onClick={() => setIsFilterSheetOpen(true)} />
            )}
          </XStack>

          <XStack marginBottom='$4' paddingHorizontal='$2' space='$2'>
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

          <TmgDrawer
            title='Filter Orders'
            icon={<FiFilter size={20} />}
            onOpenChange={setIsFilterSheetOpen}
            open={isFilterSheetOpen}
          >
            <FilterContent
              filters={filters}
              setFilters={setFilters}
              onClose={() => setIsFilterSheetOpen(false)}
            />
          </TmgDrawer>

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
        </ScrollView>
      </YStack>
    </XStack>
  );
};

export default OrdersList;
