'use client';
import AsyncSelect from '@/components/appComponets/select/AsyncSelect';
import { ServiceErrorManager } from '@/helpers/service';
import { Product } from '@/types/products';
import { startCase } from 'lodash-es';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Input, Separator, SizableText, Text, YStack } from 'tamagui';
import { ListCategoriesService } from '@/services/categories';

const BasicInformation = ({ form }: { form: UseFormReturn<Product> }) => {
  const {
    control,
    formState: { errors },
  } = form;

  const category = form.watch('category');

  const getProductCategory = useCallback(
    async (search: string, type: string, categoryId?: string) => {
      const [_, data] = await ServiceErrorManager(
        ListCategoriesService(1, 20, search, type, true, categoryId)(),
        {
          failureMessage: 'Error while getting product category list',
        }
      );
      return (data?.docs || []).map((category: any) => ({
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

      {/* Product Name */}
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
              searchable
              loadOptions={(searchQuery) =>
                getProductCategory(searchQuery, 'category')
              }
              value={field.value?.value}
              defaultLabel={field.value?.label}
              onChange={(value) => {
                field.onChange(value);
                form.setValue('subCategory', { value: '', label: '' });
              }}
              isAsync
            />
          )}
        />
        {errors.category && (
          <Text color='$red10'>{errors.category.message}</Text>
        )}
      </YStack>

      {category && (
        <YStack space='$2'>
          <Text>Sub Category *</Text>
          <Controller
            name='subCategory'
            control={control}
            rules={{ required: 'Sub category is required' }}
            render={({ field }) => (
              <AsyncSelect
                key={category?.value || category}
                searchable
                loadOptions={(searchQuery) =>
                  getProductCategory(
                    searchQuery,
                    'subCategory',
                    category?.value || category
                  )
                }
                isAsync
                value={field.value?.value}
                defaultLabel={field?.value?.label}
                onChange={(value) => field.onChange(value)}
              />
            )}
          />
          {errors.subCategory && (
            <Text color='$red10'>{errors.subCategory.message}</Text>
          )}
        </YStack>
      )}
    </YStack>
  );
};

export default BasicInformation;
