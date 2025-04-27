import AsyncSelect from '@/components/appComponets/select/AsyncSelect';
import React, { memo, useCallback } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Separator, SizableText, YStack, Text, Input } from 'tamagui';
import CreateProductCategory from './CreateProductCategory';
import { startCase } from 'lodash-es';
import { ServiceErrorManager } from '@/helpers/service';
import { ListService } from '@/services/crud';
import { Product } from '@/types/products';

const BasicInformation = ({ form }: { form: UseFormReturn<Product> }) => {
  const {
    control,
    formState: { errors },
  } = form;
  const getProductCategory = useCallback(
    async (search: string, type: string) => {
      const [_, data] = await ServiceErrorManager(
        ListService({
          data: {
            schema: 'Productcategory',
            options: {
              limit: 50,
            },
            query: {
              type,
              ...(search ? { search } : {}),
              searchFields: ['title'],
            },
          },
        }),
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

  return (
    <YStack space='$4'>
      <SizableText size='$5' fontWeight='bold'>
        Basic Information
      </SizableText>
      <Separator />

      <YStack space='$2'>
        <Text>Product Name *</Text>
        <Controller
          name='name'
          control={control}
          rules={{ required: 'Product name is required' }}
          render={({ field }) => (
            <Input
              {...field}
              placeholder='Enter product name'
              borderColor={errors.name ? '$red10' : undefined}
            />
          )}
        />
        {errors.name && <Text color='$red10'>{errors.name.message}</Text>}
      </YStack>

      <YStack space='$2'>
        <Text>Description</Text>
        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <Input
              multiline
              numberOfLines={4}
              {...field}
              placeholder='Enter product description'
            />
          )}
        />
      </YStack>

      <YStack space='$2'>
        <Text>Category *</Text>
        <Controller
          name='category'
          control={control}
          rules={{ required: 'Category is required' }}
          render={({ field }) => (
            <AsyncSelect
              // menuChildren={({ reload }) => (
              //   <CreateProductCategory reload={reload} type='category' />
              // )}
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
      <YStack space='$2'>
        <Text>Sub Category *</Text>
        <Controller
          name='subCategory'
          control={control}
          rules={{ required: 'Sub category is required' }}
          render={({ field }) => (
            <AsyncSelect
              menuChildren={({ reload }) => (
                <CreateProductCategory reload={reload} type='subCategory' />
              )}
              searchable={true}
              loadOptions={(searchQuery) =>
                getProductCategory(searchQuery, 'subCategory')
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
    </YStack>
  );
};

export default memo(BasicInformation);
