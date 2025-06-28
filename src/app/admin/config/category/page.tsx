'use client';

import {
  YStack,
  Text,
  XStack,
  Button,
  Input,
  ScrollView,
  Switch,
  Popover,
  Adapt,
  Spinner,
} from 'tamagui';
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
import { ServiceErrorManager } from '@/helpers/service';
import {
  CreateProductCategoryServie,
  ListCategoriesService,
  RemoveProductCategoryService,
  UpdatateProductCategoryService,
} from '@/services/categories';
import { Column } from 'react-table';
import { IProductCategory } from '@/types/productCategory';
import { usePagination } from '@/hook/usePagination';
import AdminSidebar from '@/components/admin/organism/AdminSidebar';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Modal from '@/components/appComponets/modal/PopupModal';
import { Controller, useForm } from 'react-hook-form';
import AsyncSelect from '@/components/appComponets/select/AsyncSelect';
import { NewTableHOC } from '@/components/admin/organism/NewTableHOC';
import { useDarkMode } from '@/hook/useDarkMode';
import { startCase } from 'lodash-es';
import FileUpload from '@/components/appComponets/fileupload/FileUpload';
import useFileUpload from '@/components/appComponets/fileupload/useFileUpload';
import { FiSave } from 'react-icons/fi';
import { MdOutlineCancel } from 'react-icons/md';
import { RiEdit2Fill } from 'react-icons/ri';
import { getRealFiles } from '@/helpers/utils';

interface DataType {
  _id: string;
  title: string;
  type: string;
  isFeature: React.ReactNode;
  //delete: React.ReactNode;
  action: React.ReactNode;
}

const Category: FC = () => {
  const { getFileUpload } = useFileUpload();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const isDark = useDarkMode();
  const form = useForm<IProductCategory>();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fetchCategories = useCallback(
    async (page: number, limit: number, search: string) => {
      const [err, data] = await ServiceErrorManager(
        ListCategoriesService(page, limit, search)(),
        {}
      );

      if (err || !data) return;
      return data;
    },
    []
  );

  const getProductCategory = useCallback(
    async (search: string, type: string) => {
      const [_, data] = await ServiceErrorManager(
        ListCategoriesService(1, 50, search, type, true)(),
        {
          failureMessage: 'Error while getting product category list',
        }
      );
      return (data.docs || []).map((category: any) => ({
        label: startCase(category?.title),
        value: category?._id,
      }));
    },
    []
  );

  const {
    state: { loading, items: categoryList },
    action,
    paginationProps,
  } = usePagination<IProductCategory>({
    fetchFunction: fetchCategories,
  });

  const onSubmit = async (value: IProductCategory) => {
    setIsSaving(true);
    setOpenModal(true);
    const { thumbnail, _id, ...restValue } = value;
    const newThumbnailImage = getRealFiles([thumbnail]);

    let uploadedThumnail = null;

    if (newThumbnailImage.length > 0) {
      uploadedThumnail = await getFileUpload(newThumbnailImage);
    }

    await ServiceErrorManager(
      CreateProductCategoryServie({
        data: {
          query: {
            ...(_id ? { _id } : {}),
          },
          payload: {
            ...restValue,
            ...(thumbnail &&
              (uploadedThumnail
                ? { thumbnail: uploadedThumnail[0] }
                : { thumbnail: thumbnail })),
          },
        },
      }),
      {}
    );

    setOpenModal(false);
    setIsSaving(false);
    action.refresh();
    reset();
  };

  const columns: Column<DataType>[] = [
    {
      id: 'title',
      Header: 'Title',
      accessor: 'title',
      Cell: ({ value }) => startCase(value) as string,
    },
    {
      id: 'type',
      Header: 'Type',
      accessor: 'type',
      Cell: ({ value }) => startCase(value) as string,
    },
    {
      id: 'isFeature',
      Header: 'Is Featured',
      accessor: 'isFeature',
    },
    // {
    //   id: 'delete',
    //   Header: 'Delete',
    //   accessor: 'delete',
    // },
    {
      id: 'action',
      Header: 'Action',
      accessor: 'action' as const,
    },
  ];

  const rows = categoryList.map((category) => ({
    _id: category._id,
    title: category.title,
    type: category.type,
    isFeature: (
      <Switch
        checked={category.isFeatured as boolean}
        onCheckedChange={async (e) => {
          setUpdatingId(category._id);
          setIsUpdating(true);
          await ServiceErrorManager(
            UpdatateProductCategoryService(category._id)({
              data: {
                payload: { isFeatured: e },
              },
            }),
            {}
          );
          action.setItems((prev: Array<IProductCategory>) =>
            prev.map((ite) =>
              ite._id === category._id ? { ...ite, isFeatured: e } : ite
            )
          );
          setIsUpdating(false);
        }}
        size='$2.5'
        backgroundColor={category.isFeatured ? '$primary' : '$gray6'}
      >
        {isUpdating && category._id === updatingId ? (
          <Spinner />
        ) : (
          <Switch.Thumb />
        )}
      </Switch>
    ),

    // delete: (
    //   <RemoveProductCategory
    //     setCategoryList={action.setItems}
    //     category={category}
    //     shouldAdapt={true}
    //   />
    // ),
    action: (
      <Button
        icon={<RiEdit2Fill />}
        chromeless
        onPress={() => {
          setIsEdit(true);
          setOpenModal(true);
          reset(category);
        }}
      />
    ),
  }));
  return (
    <div className={`admin-container`}>
      <AdminSidebar />
      <YStack>
        <XStack padding='$4' justifyContent='flex-end'>
          <Button
            onPress={() => {
              reset({});
              setOpenModal(true);
            }}
            icon={<FaPlus />}
            color='$text'
            size='$3'
            fontSize='$3'
            marginRight='$2'
            backgroundColor='$primary'
            hoverStyle={{ backgroundColor: '$primaryHover' }}
          >
            Add Product Category
          </Button>
        </XStack>
        <Modal
          isLoading={isSaving}
          title='Create Product Category'
          //  description='Please fill in the details to create a new product category.'
          open={openModal}
          cancelTextButtonProps={{
            icon: <MdOutlineCancel />,
          }}
          onClose={() => {
            setOpenModal(false);
            reset({});
            setIsSaving(false);
            setIsEdit(false);
          }}
          confirmButtonProps={{
            backgroundColor: '$primary',
            disabled: isSaving,
            icon: isEdit ? <RiEdit2Fill /> : <FiSave size={16} />,
          }}
          confirmText={isEdit ? 'Edit' : 'Save'}
          onConfirm={() => {
            handleSubmit(onSubmit)();
          }}
        >
          <YStack space='$4' padding='$2'>
            <YStack space='$2'>
              <YStack space='$2'>
                <Text>Title *</Text>
                <Controller
                  name='title'
                  control={control}
                  rules={{ required: 'Category title is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder='Enter product name'
                      borderColor={errors.title ? '$red10' : undefined}
                    />
                  )}
                />
                {errors.title && (
                  <Text color='$red10'>{errors.title.message}</Text>
                )}
              </YStack>
              <YStack space='$2'>
                <Text>Type *</Text>
                <Controller
                  name='type'
                  control={control}
                  rules={{ required: 'Category type is required' }}
                  render={({ field }) => (
                    <AsyncSelect
                      options={[
                        { label: 'Category', value: 'category' },
                        { label: 'Sub Category', value: 'subCategory' },
                      ]}
                      {...field}
                    />
                  )}
                />
                {errors.type && (
                  <Text color='$red10'>{errors.type.message}</Text>
                )}
              </YStack>
              {form.watch('type') === 'subCategory' && (
                <YStack space='$2'>
                  <Text>Parent Category *</Text>
                  <Controller
                    name='category'
                    control={control}
                    rules={{ required: 'Category is required' }}
                    render={({ field }) => (
                      <AsyncSelect
                        menuChildren={() => <></>}
                        searchable={true}
                        loadOptions={(searchQuery) =>
                          getProductCategory(searchQuery, 'category')
                        }
                        isAsync={true}
                        {...field}
                      />
                    )}
                  />
                  {errors.category && (
                    <Text color='$red10'>{errors.category.message}</Text>
                  )}
                </YStack>
              )}

              <YStack space='$2'>
                <Text>Thumbnail </Text>
                <FileUpload
                  form={form}
                  variant='compact'
                  multiple={false}
                  name='thumbnail'
                  accept={['.jpg', '.jpeg', '.png', '.svg']}
                />
              </YStack>
            </YStack>
          </YStack>
        </Modal>
        <ScrollView>
          <NewTableHOC
            isLoading={loading}
            onSearch={(e) => action.handleOnSearch(e, 600)}
            pageSize={paginationProps.pageSize}
            isDark={isDark}
            columns={columns}
            data={rows}
            title='Product Category'
            pagination={true}
            filtering={true}
            variant={isDark ? 'default' : 'striped'}
            emptyMessage='No admins found'
            serverSidePagination={paginationProps}
          />
        </ScrollView>
      </YStack>
    </div>
  );
};

export default Category;

const RemoveProductCategory: FC<{
  shouldAdapt: boolean;
  setCategoryList: Dispatch<SetStateAction<Array<IProductCategory>>>;
  category: IProductCategory;
}> = (props) => {
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const handleRemoveFromWishlist = async (id: string) => {
    setIsRemoving(true);
    await ServiceErrorManager(RemoveProductCategoryService(id)(), {});
    props.setCategoryList((prev) =>
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
              Are you sure you want to remove this product?
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
                await handleRemoveFromWishlist(props.category._id);
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
