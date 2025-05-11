'use client';
import { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Column } from 'react-table';
import AdminSidebar from './organism/AdminSidebar';
import { NewTableHOC } from './organism/TableHOC';
import { useDarkMode } from '@/hook/useDarkMode';
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
import { usePagination } from '@/hook/usePagination';

interface DataType {
  _id: string;
  photo: ReactElement;
  name: ReactElement;
  price: ReactElement;
  stock: number;
  action: ReactElement;
  status: ReactElement;
  productID?: string;
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

  const fetchProductList = useCallback(
    async (page: number, limit: number, search: string) => {
      const [err, data] = await ServiceErrorManager(
        ProductListService({
          data: {
            options: {
              page,
              limit,
            },
            query: {
              searchFields: ['name', 'productID'],
              search,
            },
          },
        }),
        {
          failureMessage: 'Error while fetching products',
        }
      );

      if (err || !data) return;
      return data;
    },
    []
  );

  const {
    state: { loading, items: productList },
    action,
    paginationProps,
  } = usePagination<IProduct>({
    fetchFunction: fetchProductList,
  });

  const columns: Column<DataType>[] = [
    {
      id: 'photo',
      Header: 'Photo',
      accessor: 'photo',
      //   disableSortBy: true,
    },
    {
      id: 'productID',
      Header: 'Product ID',
      accessor: 'productID',
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
    productID: product?.productID,
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
            pageSize={paginationProps.pageSize}
            isLoading={loading}
            data={rows}
            onSearch={(e) => action.handleOnSearch(e, 600)}
            title='Product List'
            pagination={true}
            filtering={true}
            //   onRowClick={handleRowClick}
            variant={true ? 'default' : 'striped'}
            emptyMessage='No products found'
            serverSidePagination={paginationProps}
          />
        </ScrollView>
      </YStack>
    </div>
  );
};

export default Products;
