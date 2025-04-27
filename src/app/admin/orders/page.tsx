'use client';
import React, { useState, useMemo, useEffect, FC } from 'react';
import {
  XStack,
  YStack,
  Text,
  Card,
  Button,
  ScrollView,
  Input,
  Avatar,
  Spinner,
  H6,
} from 'tamagui';
import {
  FiSearch,
  FiPackage,
  FiFilter,
  FiRefreshCw,
  FiChevronRight,
} from 'react-icons/fi';
import { Column } from 'react-table';
import dayjs from 'dayjs';
import { NewTableHOC } from '@/components/admin/organism/TableHOC';
import AdminSidebar from '@/components/admin/organism/AdminSidebar';
import { ServiceErrorManager } from '@/helpers/service';
import {
  GetOrdersBySellerService,
  UpdateOrderItemStatusService,
} from '@/services/order';
import { IOrder, IOrderItem } from '@/types/order';
import Loader from '@/components/admin/organism/Loader';
import PriceFormatter from '@/components/appComponets/PriceFormatter/PriceFormatter';
import { useDarkMode } from '@/hook/useDarkMode';
import TmgDrawer from '@/components/appComponets/Drawer/TmgDrawer';
import AsyncSelect from '@/components/appComponets/select/AsyncSelect';
import { debounce, head, startCase } from 'lodash-es';
import EmptyState from '@/components/appComponets/Empty/EmptyState';
import PaymentStatusBadge, {
  PaymentStatus,
} from '@/components/admin/orderManagement/PaymentStatusBadge';
import StatusBadge, {
  OrderStatus,
} from '@/components/admin/orderManagement/StatusBadge';
import OrderDetails, {
  OnStatusUpdateProps,
} from '@/components/admin/orderManagement/OrderDetails';

interface DataType {
  _id: string;
  orderNumber: string;
  createdAt: string;
  customer: string;
  items: IOrderItem[];
  totalAmount: number;
  status: any;
  paymentStatus: string;
}

const Orders: FC = () => {
  const isDark = useDarkMode();
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [orderList, setOrderList] = useState<Array<IOrder>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'all'>(
    'all'
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrderList = async () => {
    setLoading(true);
    await ServiceErrorManager(
      GetOrdersBySellerService({
        data: {
          payload: {
            search: searchQuery,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            paymentStatus: paymentFilter !== 'all' ? paymentFilter : undefined,
          },
        },
      }),
      {}
    )
      .then(([_, response]) => {
        setOrderList(response);
      })
      .finally(() => setLoading(false));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrderList();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchOrderList();
  }, [statusFilter, paymentFilter]);

  const handleRowClick = (row: any) => {
    const order = row.original;

    setSelectedOrder(order);
    setShowDetails(true);
  };

  const handleStatusUpdate = async (param: OnStatusUpdateProps) => {
    await ServiceErrorManager(
      UpdateOrderItemStatusService({
        data: {
          payload: param,
        },
      }),
      { successMessage: 'Status updated successfully' }
    );
    setOrderList((prevOrders) =>
      prevOrders.map((order) => {
        if (order._id === param.order) {
          return {
            ...order,
            items: order.items.map((item) => ({
              ...item,
              status: param.status,
            })),
          };
        }
        return order;
      })
    );
  };

  const columns = useMemo<Column<DataType>[]>(
    () => [
      {
        id: 'customer',
        Header: 'Customer',
        accessor: 'customer',
        Cell: ({ value }) => (
          <XStack space='$2' alignItems='center'>
            <Avatar circular size='$2' backgroundColor='$blue5'>
              <Text color='$blue11' fontSize='$4'>
                {head(startCase(value))}
              </Text>
            </Avatar>
            <Text>{value}</Text>
          </XStack>
        ),
      },
      {
        id: 'OrderID',
        Header: 'Order ID',
        accessor: 'orderNumber',
        Cell: ({ value }) => (
          <Text fontWeight='500' color='$blue10'>
            #{value}
          </Text>
        ),
      },

      {
        id: 'createdAt',
        Header: 'Date',
        accessor: 'createdAt',
        Cell: ({ value }) => dayjs(value).format('DD/MM/YYYY'),
      },
      {
        id: 'items',
        Header: 'Items',
        accessor: 'items',
        Cell: ({ value }) => (
          <XStack space='$1' alignItems='center'>
            <FiPackage size={14} />
            <Text>{value.length} item(s)</Text>
          </XStack>
        ),
      },
      {
        id: 'totalAmount',
        Header: 'Total',
        accessor: 'totalAmount',
        Cell: (value) => {
          return <PriceFormatter value={value.value} />;
        },
      },
      {
        id: 'paymentStatus',
        Header: 'Payment',
        accessor: 'paymentStatus',
        Cell: ({ value }) => (
          <PaymentStatusBadge status={value as PaymentStatus} />
        ),
      },
      {
        id: 'Status',
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => <StatusBadge status={value?.[0]?.status} />,
      },
      {
        // Header: 'actions',
        id: 'actions',
        Cell: () => <Button size='$2' chromeless icon={FiChevronRight} />,
      },
    ],
    []
  );

  const handleSearch = (searchValue: string) => {
    setSearchQuery(searchValue);
    debounce(() => fetchOrderList(), 500);
  };

  const rows: DataType[] = orderList.map((order) => ({
    ...order,
    _id: order._id,
    customerDetails: order.customer,
    orderNumber: order.orderNumber,
    createdAt: order.createdAt.toString(),
    customer: order.customer.name,
    items: order.items,
    totalAmount:
      order.items.reduce((acc, data) => acc + data.price, 0) +
      order.taxAmount +
      order.deliveryCharge +
      order.serviceCharge,
    status: order.items,
    paymentStatus: order.paymentStatus,
  }));

  return (
    <div className={`admin-container`}>
      <AdminSidebar />

      <YStack flex={1} padding='$3'>
        <Card marginBottom='$2'>
          <XStack
            justifyContent='space-between'
            alignItems='center'
            marginBottom='$4'
          >
            <H6>Order Management</H6>
            <Button
              size='$3'
              icon={isRefreshing ? Spinner : FiRefreshCw}
              onPress={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </XStack>

          <XStack space='$4' flexWrap='wrap'>
            <XStack space='$2' minWidth={150} alignItems='center'>
              <FiSearch size={16} />
              <Input
                width='$20'
                size='$3'
                flex={1}
                placeholder='Search by order ID or customer'
                value={searchQuery}
                onChange={(e) => handleSearch(e.nativeEvent.text)}
              />
            </XStack>

            <XStack space='$2' alignItems='center'>
              <FiFilter size={16} />
              <Text>Status:</Text>
              <AsyncSelect
                width='$12'
                marginBottom={0}
                size='$3'
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'accepted', label: 'Accepted' },
                  { value: 'shipped', label: 'Shipped' },
                  { value: 'delivered', label: 'Delivered' },
                  { value: 'canceled', label: 'Cancelled' },
                ]}
                value={statusFilter}
                onChange={(value) =>
                  setStatusFilter(value as OrderStatus | 'all')
                }
              />
            </XStack>

            <XStack space='$2' alignItems='center'>
              <Text>Payment:</Text>
              <AsyncSelect
                width='$15'
                marginBottom={0}
                size='$3'
                options={[
                  { value: 'all', label: 'All Payment Statuses' },
                  { value: 'pending', label: 'Payment Pending' },
                  { value: 'paid', label: 'Paid' },
                  { value: 'partial', label: 'Partially Paid' },
                ]}
                value={paymentFilter}
                onChange={(value) =>
                  setPaymentFilter(value as PaymentStatus | 'all')
                }
              />
            </XStack>
          </XStack>
        </Card>

        {loading ? (
          <Loader />
        ) : (
          <ScrollView>
            {rows.length > 0 ? (
              <NewTableHOC
                columns={columns}
                data={rows}
                title=''
                pagination={true}
                filtering={false}
                pageSize={10}
                variant='striped'
                size='md'
                emptyMessage='No orders found'
                onRowClick={handleRowClick}
                onSearch={undefined}
                isDark={isDark}
              />
            ) : (
              <Card padding='$8' alignItems='center'>
                <EmptyState
                  icon={<FiPackage size={48} color='#999' />}
                  title='No Orders Found'
                  description='There are no orders matching your current filters'
                  actionButton={
                    <Button
                      icon={FiRefreshCw}
                      onPress={() => {
                        setStatusFilter('all');
                        setPaymentFilter('all');
                        setSearchQuery('');
                        fetchOrderList();
                      }}
                    >
                      Reset Filters
                    </Button>
                  }
                />
              </Card>
            )}
          </ScrollView>
        )}
        <TmgDrawer
          snapPoints={[90]}
          forceRemoveScrollEnabled
          open={showDetails}
          onOpenChange={setShowDetails}
          showCloseButton
          // dismissOnSnapToBottom
        >
          <OrderDetails
            order={selectedOrder}
            onClose={() => setShowDetails(false)}
            onStatusUpdate={handleStatusUpdate}
          />
        </TmgDrawer>
      </YStack>
    </div>
  );
};

export default Orders;
