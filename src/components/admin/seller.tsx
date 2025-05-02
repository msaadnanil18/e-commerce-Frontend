'use client';

import { ReactElement, useEffect, useState } from 'react';
import { FaRegUserCircle, FaTrash, FaUser } from 'react-icons/fa';
import { Column } from 'react-table';
import { NewTableHOC } from './organism/TableHOC';
import AdminSidebar from './organism/AdminSidebar';
import { Button, ScrollView, XStack, YStack } from 'tamagui';
import { ServiceErrorManager } from '@/helpers/service';

import { useRouter } from 'next/navigation';
import RenderDriveFile from '../appComponets/fileupload/RenderDriveFile';

import { RiEdit2Fill } from 'react-icons/ri';
import Loader from './organism/Loader';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { SellerListService } from '@/services/seller';
import { ISeller } from '@/types/seller';

interface DataType {
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
  const router = useRouter();
  const [sellerList, SetSellerList] = useState<Array<ISeller>>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const fetchSellerList = async (page = 1, limit = pageSize) => {
    setLoading(true);
    const [err, data] = await ServiceErrorManager(
      SellerListService({
        data: {
          options: {
            page,
            limit,
          },
        },
      }),
      {
        failureMessage: 'Error while fetching seller list ',
      }
    );
    setLoading(false);
    if (err || !data) return;
    SetSellerList(data.docs || []);

    setTotalCount(data.totalDocs || 0);
    setPageCount(data.totalPages || 1);
    setCurrentPage(data.page || 1);
  };

  useEffect(() => {
    fetchSellerList().catch(console.log);
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const columns: Column<DataType>[] = [
    {
      id: '345',
      Header: 'User',
      accessor: 'avatar',
      //   disableSortBy: true,
    },
    {
      id: '3458848',
      Header: 'Business Name',
      accessor: 'businessName',
      //  disableSortBy: true,
    },
    {
      id: '3345432345',
      Header: 'Name',
      accessor: 'name',
      // Cell: (value) => {
      //   return
      // },
    },
    {
      id: '333456776543',
      Header: ' Email',
      accessor: 'email',
    },
    {
      id: '345654321245',
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
    avatar: (
      <FaRegUserCircle size={25} />
      // <RenderDriveFile
      //   style={{
      //     width: '64px',
      //     height: '64px',
      //     objectFit: 'cover',
      //     borderRadius: '4px',
      //   }}
      //   file={
      //     typeof seller?.documents?.[0] === 'string' || !seller?.documents?.[0]
      //       ? {}
      //       : (seller?.documents?.[0] as File)
      //   }
      // />
    ),
    email: seller.user.email || '',
    name: seller.user.name,
    // name: seller.user.name,
    gender: 'Male',
    phone: seller.contactPhone,
    // action: (
    //   <Button
    //     icon={<RiEdit2Fill />}
    //     chromeless
    //     onPress={() => router.push(`/admin/product/${seller._id}`)}
    //   />
    // ),
  }));

  return (
    <YStack>
      <XStack padding='$4' justifyContent='flex-end' />
      {loading ? (
        <Loader />
      ) : (
        <ScrollView>
          <NewTableHOC
            columns={columns}
            data={rows}
            title='Sellers'
            pagination={true}
            filtering={true}
            onRowClick={handleRowClick}
            variant={true ? 'default' : 'striped'}
            //  className={isDark ? 'bg-gray-800 text-white' : ''}
            emptyMessage='No products found'
            // Custom props for server-side pagination
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

export default Sellers;
