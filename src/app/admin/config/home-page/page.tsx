'use client';

import { ServiceErrorManager } from '@/helpers/service';
import { usePagination } from '@/hook/usePagination';
import { useScreen } from '@/hook/useScreen';
import { ListHomePageConfigService } from '@/services/homePageConfig';
import { IHomePageConfig } from '@/types/HomePageConfig';
import { useRouter } from 'next/navigation';
import { FC, ReactElement, useCallback } from 'react';
import { FaPlus } from 'react-icons/fa';
import { RiEdit2Fill } from 'react-icons/ri';
import { Column } from 'react-table';
import { Button, Text, XStack, YStack, ScrollView } from 'tamagui';
import { useDarkMode } from '@/hook/useDarkMode';
import { NewTableHOC } from '@/components/admin/organism/NewTableHOC';
import AdminSidebar from '@/components/admin/organism/AdminSidebar';

interface DataType {
  _id: string;
  name: ReactElement;
  isActive: ReactElement;
  featuredCount: ReactElement;
  lastModified: ReactElement;
  action: ReactElement;
}

const HomePageConfig: FC = () => {
  const router = useRouter();
  const isDark = useDarkMode();

  const fetchHomeConfigList = useCallback(
    async (page: number, limit: number, search: string) => {
      const [err, data] = await ServiceErrorManager(
        ListHomePageConfigService({
          data: {
            options: {
              page,
              limit,
            },
            query: {
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
    state: { loading, items: homeConfigList },
    action,
    paginationProps,
  } = usePagination<IHomePageConfig>({
    fetchFunction: fetchHomeConfigList,
  });

  const handleEdit = (config: IHomePageConfig) => {
    router.push(`/admin/config/home-page/update/${config._id}`);
  };

  const columns: Column<DataType>[] = [
    {
      id: 'name',
      Header: 'Name',
      accessor: 'name',
    },
    {
      id: 'isActive',
      Header: 'Active',
      accessor: 'isActive',
    },
    {
      id: 'featuredCount',
      Header: 'Featured Products',
      accessor: 'featuredCount',
    },
    {
      id: 'lastModified',
      Header: 'Last Modified',
      accessor: 'lastModified',
    },
    {
      id: 'action',
      Header: 'Action',
      accessor: 'action',
    },
  ];

  const rows: DataType[] = homeConfigList.map((config) => ({
    _id: config._id,
    name: <Text>{config.name}</Text>,
    isActive: (
      <Text color={config.isActive ? '$green10' : '$red10'}>
        {config.isActive ? 'Yes' : 'No'}
      </Text>
    ),
    featuredCount: <Text>{config.featuredProducts?.length || 0}</Text>,
    lastModified: (
      <Text>
        {config.updatedAt
          ? new Date(config.updatedAt).toLocaleDateString()
          : 'N/A'}
      </Text>
    ),
    action: (
      <Button
        size='$3'
        chromeless
        icon={<RiEdit2Fill size={16} />}
        onPress={() => handleEdit(config)}
      />
    ),
  }));

  return (
    <div className='admin-container'>
      <AdminSidebar />
      <YStack>
        <XStack padding='$4' justifyContent='flex-end'>
          <Button
            onPress={() => router.push('/admin/config/home-page/create')}
            icon={<FaPlus />}
            color='$text'
            size='$3'
            fontSize='$3'
            marginRight='$2'
            backgroundColor='$primary'
            hoverStyle={{ backgroundColor: '$primaryHover' }}
          >
            Set Home Config
          </Button>
        </XStack>

        <ScrollView>
          <NewTableHOC
            isLoading={loading}
            onSearch={(e) => action.handleOnSearch(e, 600)}
            isDark={isDark}
            pageSize={paginationProps.pageSize}
            columns={columns}
            data={rows}
            title='Home Page Config List'
            pagination={true}
            filtering={true}
            variant='default'
            emptyMessage='No configurations found'
            serverSidePagination={paginationProps}
          />
        </ScrollView>
      </YStack>
    </div>
  );
};

export default HomePageConfig;
