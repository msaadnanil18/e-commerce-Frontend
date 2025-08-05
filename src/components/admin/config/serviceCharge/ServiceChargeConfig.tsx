'use client';

import { ServiceErrorManager } from '@/helpers/service';
import { ListServiceCharges } from '@/services/serviceCharges';
import { ServiceCharge } from '@/types/ServiceCharge';
import { useRouter } from 'next/navigation';
import { FC, ReactElement, useCallback } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Column } from 'react-table';
import { FiMapPin, FiPercent, FiTag } from 'react-icons/fi';
import { YStack, XStack, Button, ScrollView, Text } from 'tamagui';
import { useDarkMode } from '@/hook/useDarkMode';
import { NewTableHOC } from '../../organism/TableHOC';
import { startCase } from 'lodash-es';
import { RiEdit2Fill } from 'react-icons/ri';
import { usePagination } from '@/hook/usePagination';

interface DataType {
  _id: string;
  category: ReactElement;
  value: ReactElement;
  minOrderValue: ReactElement;
  applicableStates: ReactElement;
  action: ReactElement;
}

const ServiceChargeConfig: FC = () => {
  const router = useRouter();
  const isDark = useDarkMode();

  const fetchServiceCharge = useCallback(
    async (page: number, limit: number, search: string) => {
      const [err, data] = await ServiceErrorManager(
        ListServiceCharges({
          data: {
            options: {
              page,
              limit,
            },
            query: {
              searchFields: ['businessName', 'contactEmail'],
              search,
            },
          },
        }),
        {}
      );

      if (err || !data) return;
      return data;
    },
    []
  );

  const {
    state: { loading, items: serviceCharges },
    action,
    paginationProps,
  } = usePagination<ServiceCharge>({
    fetchFunction: fetchServiceCharge,
  });

  const handleEdit = (charge: ServiceCharge) => {
    router.push(`/admin/config/service-charge/update/${charge._id}`);
  };

  const columns: Column<DataType>[] = [
    {
      id: 'category',
      Header: 'Category',
      accessor: 'category',
    },
    {
      id: 'value',
      Header: 'Charge Value',
      accessor: 'value',
    },
    {
      id: 'minOrderValue',
      Header: 'Min Order Value',
      accessor: 'minOrderValue',
    },
    {
      id: 'applicableStates',
      Header: 'Applicable States',
      accessor: 'applicableStates',
    },
    {
      id: 'action',
      Header: 'Action',
      accessor: 'action',
    },
  ];

  const rows: DataType[] = serviceCharges.map((charge) => ({
    _id: charge._id,
    category: (
      <XStack space='$2' alignItems='center'>
        <FiTag size={18} />
        <Text>{startCase(charge.category.title)}</Text>
      </XStack>
    ),
    value: (
      <XStack space='$1' alignItems='center'>
        {charge.chargeType === 'percentage' ? <FiPercent size={14} /> : 'Flat'}
        <Text>
          {charge.value}
          {charge.chargeType === 'percentage' ? '%' : ''}
        </Text>
      </XStack>
    ),
    minOrderValue: charge.minOrderValue ? (
      <Text>{charge.minOrderValue}</Text>
    ) : (
      <Text opacity={0.5}>N/A</Text>
    ),
    applicableStates:
      charge.applicableStates && charge.applicableStates.length > 0 ? (
        <XStack space='$1' alignItems='center'>
          <FiMapPin size={14} />
          <Text>{charge.applicableStates.join(', ')}</Text>
        </XStack>
      ) : (
        <Text opacity={0.5}>All States</Text>
      ),
    action: (
      <Button
        size='$3'
        chromeless
        icon={<RiEdit2Fill size={16} />}
        onPress={() => handleEdit(charge)}
      />
    ),
  }));

  return (
    <YStack>
      <XStack padding='$4' justifyContent='flex-end'>
        <Button
          onPress={() => router.push('/admin/config/service-charge/create')}
          icon={<FaPlus />}
          color='$text'
          size='$3'
          fontSize='$3'
          marginRight='$2'
          backgroundColor='$primary'
          hoverStyle={{ backgroundColor: '$primaryHover' }}
        >
          Set Service Charge
        </Button>
      </XStack>

      <ScrollView scrollbarWidth='thin'>
        <NewTableHOC
          isLoading={loading}
          onSearch={(e) => action.handleOnSearch(e, 600)}
          isDark={isDark}
          pageSize={paginationProps.pageSize}
          columns={columns}
          data={rows}
          title='Service Charge List'
          pagination={true}
          filtering={true}
          variant='default'
          emptyMessage='No service charges found'
          serverSidePagination={paginationProps}
        />
      </ScrollView>
    </YStack>
  );
};

export default ServiceChargeConfig;
