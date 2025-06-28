'use client';

import { ServiceErrorManager } from '@/helpers/service';
import { usePagination } from '@/hook/usePagination';
import { useScreen } from '@/hook/useScreen';
import {
  ListHomePageConfigService,
  UpdateHomePageConfigService,
} from '@/services/homePageConfig';
import { IHomePageConfig } from '@/types/HomePageConfig';
import { useRouter } from 'next/navigation';
import {
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { Column } from 'react-table';
import {
  Button,
  Text,
  XStack,
  YStack,
  ScrollView,
  Popover,
  Adapt,
  Switch,
  Spinner,
} from 'tamagui';
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
  const screen = useScreen();
  const [updatingId, setUpdatingId] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
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
      <Switch
        checked={config.isActive as boolean}
        onCheckedChange={async (e) => {
          setUpdatingId(config._id);
          setIsUpdating(true);
          await ServiceErrorManager(
            UpdateHomePageConfigService(config._id)({
              data: {
                isActive: true,
              },
            }),
            {}
          );
          action.setItems((prev: Array<IHomePageConfig>) =>
            prev.map((ite) =>
              ite._id === config._id
                ? { ...ite, isActive: true }
                : { ...ite, isActive: false }
            )
          );
          setIsUpdating(false);
        }}
        size='$2.5'
        backgroundColor={config.isActive ? '$primary' : '$gray6'}
      >
        {isUpdating && config._id === updatingId ? (
          <Spinner />
        ) : (
          <Switch.Thumb />
        )}
      </Switch>
      // <Text color={config.isActive ? '$green10' : '$red10'}>
      //   {config.isActive ? 'Yes' : 'No'}
      // </Text>
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
      <RemoveHomeConfigurations
        homePageConfigList={config}
        setHomePageConfigList={action.setItems}
        shouldAdapt={screen.xs}
      />
      // <Button
      //   size='$3'
      //   chromeless
      //   icon={<RiEdit2Fill size={16} />}
      //   onPress={() => handleEdit(config)}
      // />
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
            title='Home Page Configurations'
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

const RemoveHomeConfigurations: FC<{
  shouldAdapt: boolean;
  setHomePageConfigList: Dispatch<SetStateAction<Array<IHomePageConfig>>>;
  homePageConfigList: IHomePageConfig;
}> = (props) => {
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const handleRemoveFromWishlist = async (id: string) => {
    setIsRemoving(true);
    await ServiceErrorManager(UpdateHomePageConfigService(id)(), {});
    props.setHomePageConfigList((prev) =>
      prev.filter((category) => category._id !== id)
    );
    setIsRemoving(false);
  };
  return (
    <Popover
      open={open}
      size='$5'
      allowFlip
      stayInFrame
      offset={15}
      resize
      {...props}
    >
      <Popover.Trigger asChild>
        <Button
          size='$3'
          unstyled
          marginTop='$2'
          icon={<FaTrash size={14} />}
          disabled={props.homePageConfigList.isActive}
          onPress={() => setOpen(true)}
        />
      </Popover.Trigger>

      {props.shouldAdapt && (
        <Adapt platform='touch'>
          <Popover.Sheet modal dismissOnSnapToBottom>
            <Popover.Sheet.Frame padding='$4'>
              <Adapt.Contents />
            </Popover.Sheet.Frame>
            <Popover.Sheet.Overlay
              backgroundColor='$shadowColor'
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Popover.Sheet>
        </Adapt>
      )}

      <Popover.Content
        borderWidth={1}
        borderColor='$borderColor'
        width={300}
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
      >
        <Popover.Arrow borderWidth={1} borderColor='$borderColor' />

        <YStack gap='$3'>
          <XStack gap='$3'>
            <Text fontSize='$3'>
              Are you sure you want to remove this Config?
            </Text>
          </XStack>

          <XStack>
            <Button size='$3' unstyled onPress={() => setOpen(false)}>
              <Text fontSize='$3' color='$gray10'>
                CANCEL
              </Text>
            </Button>
            <Button
              size='$3'
              unstyled
              disabled={isRemoving}
              onPress={async () => {
                await handleRemoveFromWishlist(props.homePageConfigList._id);
                setOpen(false);
              }}
            >
              <Text fontSize='$3' color='$red10'>
                {isRemoving ? 'REMOVING...' : 'YES, REMOVE'}
              </Text>
            </Button>
          </XStack>
        </YStack>
      </Popover.Content>
    </Popover>
  );
};
