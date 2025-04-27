'use client';

import { ServiceErrorManager } from '@/helpers/service';
import { ListServiceCharges } from '@/services/serviceCharges';
import { ServiceCharge } from '@/types/ServiceCharge';
import { useRouter } from 'next/navigation';
import { FC, ReactElement, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Column } from 'react-table';
import { FiEdit2, FiMapPin, FiPercent, FiTag } from 'react-icons/fi';
import {
  YStack,
  XStack,
  Button,
  H6,
  ScrollView,
  SizableText,
  Text,
} from 'tamagui';

import { useDarkMode } from '@/hook/useDarkMode';
import Loader from '../../organism/Loader';
import { NewTableHOC } from '../../organism/TableHOC';
import { startCase } from 'lodash-es';
import { RiEdit2Fill } from 'react-icons/ri';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [serviceCharges, setServiceCharges] = useState<ServiceCharge[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const fetchServiceCharge = () => {
    setLoading(true);
    ServiceErrorManager(ListServiceCharges(), {})
      .then(([_, response]) => {
        setServiceCharges(response.docs);
        setTotalCount(response.totalDocs || 0);
        setPageCount(response.totalPages || 1);
        setCurrentPage(response.page || 1);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServiceCharge();
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Add implementation to fetch data for the new page
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    // Add implementation to fetch data with new page size
  };

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

      {loading ? (
        <Loader />
      ) : (
        <ScrollView>
          <NewTableHOC
            isDark={isDark}
            columns={columns}
            data={rows}
            title='Service Charge List'
            pagination={true}
            filtering={true}
            variant='default'
            emptyMessage='No service charges found'
            serverSidePagination={{
              pageCount: pageCount,
              pageIndex: currentPage - 1,
              pageSize: pageSize,
              totalCount: totalCount,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
          />
        </ScrollView>
      )}
    </YStack>
  );
};

export default ServiceChargeConfig;
