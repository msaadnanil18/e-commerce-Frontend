'use client';
import { FC, ReactElement, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Column } from 'react-table';
import AdminSidebar from './organism/AdminSidebar';
import { NewTableHOC } from './organism/TableHOC';
import { useDarkMode } from '@/hook/useDarkMode';
import Loader from './organism/Loader';
import { Button, ScrollView, Text, View, XStack, YStack } from 'tamagui';
import { useRouter } from 'next/navigation';
import { RiEdit2Fill } from 'react-icons/ri';
import { ServiceErrorManager } from '@/helpers/service';
import { ProductListService } from '@/services/products';
import { IProduct } from '@/types/products';
import RenderDriveFile from '../appComponets/fileupload/RenderDriveFile';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { truncate } from 'lodash-es';
import { permissions } from '@/constant/permissions';
import usePermission from '@/hook/usePermission';
import ProductStatusTag from './management/productdetails/ProductstatusColor';
import PriceFormatter from '../appComponets/PriceFormatter/PriceFormatter';

interface DataType {
  _id: string;
  photo: ReactElement;
  name: ReactElement;
  price: ReactElement;
  stock: number;
  action: ReactElement;
  status: ReactElement;
}

const Name = ({
  product,
  router,
}: {
  product: IProduct;
  router: AppRouterInstance;
}) => (
  <Text
    onPress={() => router.push(`/admin/product/product-details/${product._id}`)}
    hoverStyle={{
      color: '$linkColor',
      cursor: 'pointer',
    }}
  >
    {truncate(product.name, { length: 20 })}
  </Text>
);

const Products: FC = () => {
  const { hasPermission } = usePermission();
  const router = useRouter();
  const isDark = useDarkMode();
  const [productList, setProductList] = useState<Array<IProduct>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const fetchProductList = async (page = 1, limit = pageSize) => {
    setLoading(true);

    const [err, data] = await ServiceErrorManager(
      ProductListService({
        data: {
          options: {
            page,
            limit,
          },
        },
      }),
      {
        failureMessage: 'Error while fetching products',
      }
    );

    setLoading(false);

    if (err || !data) return;

    setProductList(data.docs);
    setTotalCount(data.totalDocs || 0);
    setPageCount(data.totalPages || 1);
    setCurrentPage(data.page || 1);
  };

  useEffect(() => {
    fetchProductList().catch(console.log);
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
      id: 'photo',
      Header: 'Photo',
      accessor: 'photo',
      //   disableSortBy: true,
    },
    {
      id: 'name',
      Header: 'Name',
      accessor: 'name',
    },
    {
      id: '333456776543',
      Header: 'Price',
      accessor: 'price',
    },
    {
      id: 'status',
      Header: 'Status',
      accessor: 'status',
    },
    {
      id: 'stock',
      Header: 'Stock',
      accessor: 'stock',
    },
    ...(hasPermission(permissions.CAN_MANAGE_PRODUCTS)
      ? [
          {
            id: 'action',
            Header: 'Action',
            accessor: 'action' as const,
          },
        ]
      : []),
  ];

  const rows: DataType[] = productList.map((product) => ({
    _id: product._id,
    photo: (
      <RenderDriveFile
        style={{
          width: '64px',
          height: '64px',
          objectFit: 'cover',
          borderRadius: '4px',
        }}
        file={product.thumbnail}
      />
    ),
    name: <Name product={product} router={router} />,
    status: <ProductStatusTag product={product} />,
    price: product.variants[0].discount ? (
      <View>
        <PriceFormatter crossed value={product.variants[0]?.price} />
        <PriceFormatter value={product.variants[0]?.originalPrice} />
      </View>
    ) : (
      <PriceFormatter value={product.variants[0]?.originalPrice} />
    ),

    stock: product.variants[0].inventory,
    action: (
      <Button
        icon={<RiEdit2Fill />}
        chromeless
        onPress={() =>
          router.push(`/admin/product/product-manage/${product._id}`)
        }
      />
    ),
  }));

  return (
    <div className={`admin-container`}>
      <AdminSidebar />
      {loading ? (
        <Loader />
      ) : (
        <YStack>
          <XStack padding='$4' justifyContent='flex-end'>
            {hasPermission(permissions.CAN_MANAGE_PRODUCTS) && (
              <Button
                onPress={() => router.push('/admin/product/create')}
                icon={<FaPlus />}
                color='$text'
                size='$3'
                fontSize='$3'
                marginRight='$2'
                backgroundColor='$primary'
                hoverStyle={{ backgroundColor: '$primaryHover' }}
              >
                Add New
              </Button>
            )}
          </XStack>

          <ScrollView>
            <NewTableHOC
              isDark={isDark}
              columns={columns}
              data={rows}
              title='Product List'
              pagination={true}
              filtering={true}
              //   onRowClick={handleRowClick}
              variant={true ? 'default' : 'striped'}
              //  className={isDark ? 'bg-gray-800 text-white' : ''}
              emptyMessage='No products found'
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
        </YStack>
      )}
    </div>
  );
};

export default Products;
