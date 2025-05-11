'use client';

import { ReactElement, useCallback, useState } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import { Column } from 'react-table';
import { NewTableHOC } from './organism/TableHOC';
import { ScrollView, XStack, YStack } from 'tamagui';
import { ServiceErrorManager } from '@/helpers/service';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { SellerListService } from '@/services/seller';
import { ISeller } from '@/types/seller';
import { useDarkMode } from '@/hook/useDarkMode';
import { usePagination } from '@/hook/usePagination';

interface DataType {
  _id: string;
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role?: string;
  phone: string;
  businessName: ReactElement;
}

const BusinessName = ({
  seller,
  router,
}: {
  seller: ISeller;
  router: AppRouterInstance;
}) => (
  <div
    onClick={() => router.push(`/admin/seller/seller-details/${seller._id}`)}
    className='hover:text-blue-600'
  >
    {seller.businessName}
  </div>
);

const Sellers = () => {
  const isDark = useDarkMode();
  const router = useRouter();

  const fetchSellerList = useCallback(
    async (page: number, limit: number, search: string) => {
      const [err, data] = await ServiceErrorManager(
        SellerListService({
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
        {
          failureMessage: 'Error while fetching seller list',
        }
      );
      if (err || !data) return;
      return data;
    },
    []
  );

  const {
    state: { loading, items: sellerList },
    action,
    paginationProps,
  } = usePagination<ISeller>({
    fetchFunction: fetchSellerList,
  });

  const columns: Column<DataType>[] = [
    {
      id: 'avatar',
      Header: 'User',
      accessor: 'avatar',
    },
    {
      id: 'businessName',
      Header: 'Business Name',
      accessor: 'businessName',
    },
    {
      id: 'name',
      Header: 'Name',
      accessor: 'name',
    },
    {
      id: 'email',
      Header: 'Email',
      accessor: 'email',
    },
    {
      id: 'phone',
      Header: 'Phone',
      accessor: 'phone',
    },
  ];

  const handleRowClick = (row: any) => {
    router.push(`/admin/seller/seller-details/${row.original._id}`);
  };

  const rows: DataType[] = sellerList.map((seller) => ({
    _id: seller._id,
    businessName: <BusinessName seller={seller} router={router} />,
    avatar: <FaRegUserCircle size={25} />,
    email: seller.user.email || '',
    name: seller.user.name,
    gender: 'Male',
    phone: seller.contactPhone,
  }));

  return (
    <YStack>
      <XStack padding='$4' justifyContent='flex-end' />
      <ScrollView>
        <NewTableHOC
          onSearch={(e) => action.handleOnSearch(e, 600)}
          pageSize={paginationProps.pageSize}
          columns={columns}
          data={rows}
          isLoading={loading}
          isDark={isDark}
          title='Sellers'
          pagination={true}
          filtering={true}
          onRowClick={handleRowClick}
          variant={isDark ? 'default' : 'striped'}
          emptyMessage='No sellers found'
          serverSidePagination={paginationProps}
        />
      </ScrollView>
    </YStack>
  );
};

export default Sellers;
