'use client';

import {
  YStack,
  Text,
  XStack,
  Button,
  Form,
  Input,
  ScrollView,
  Switch,
} from 'tamagui';
import React, { FC, useCallback, useState } from 'react';
import { ServiceErrorManager } from '@/helpers/service';
import {
  CreateProductCategoryServie,
  ListCategoriesService,
} from '@/services/categories';
import { Column } from 'react-table';
import { IProductCategory } from '@/types/productCategory';
import { usePagination } from '@/hook/usePagination';
import AdminSidebar from '@/components/admin/organism/AdminSidebar';
import { FaPlus } from 'react-icons/fa';
import Modal from '@/components/appComponets/modal/PopupModal';
import { Controller, useForm } from 'react-hook-form';
import AsyncSelect from '@/components/appComponets/select/AsyncSelect';
import { NewTableHOC } from '@/components/admin/organism/NewTableHOC';
import { useDarkMode } from '@/hook/useDarkMode';
import { startCase } from 'lodash-es';

interface DataType {
  _id: string;
  title: string;
  type: string;
  isFeature: React.ReactNode;
}

const Category: FC = () => {
  const isDark = useDarkMode();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IProductCategory>();
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
    await ServiceErrorManager(
      CreateProductCategoryServie({
        data: {
          payload: value,
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
      Cell: ({ value }) => {
        console.log(value, 'value in cell');
        return (
          <Switch
            checked={value as boolean}
            onCheckedChange={() => {}}
            size='$2.5'
            backgroundColor={value ? '$primary' : '$gray6'}
          >
            <Switch.Thumb />
          </Switch>
        );
      },
    },
  ];

  const rows = categoryList.map((category) => ({
    _id: category._id,
    title: category.title,
    type: category.type,
    isFeature: category.isFeatured,
  }));
  return (
    <div className={`admin-container`}>
      <AdminSidebar />
      <YStack>
        <XStack padding='$4' justifyContent='flex-end'>
          <Button
            onPress={() => setOpenModal(true)}
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
          onClose={() => {
            setOpenModal(false);
            reset();
            setIsSaving(false);
          }}
          confirmButtonProps={{
            backgroundColor: '$primary',
            disabled: isSaving,
          }}
          onConfirm={handleSubmit(onSubmit)}
        >
          <YStack space='$4' padding='$2'>
            <Form onSubmit={handleSubmit(onSubmit)}>
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
                  {errors.title && (
                    <Text color='$red10'>{errors.title.message}</Text>
                  )}
                </YStack>
              </YStack>
            </Form>
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
            title='Admins'
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
