'use client';

import AsyncSelect from '@/components/appComponets/select/AsyncSelect';
import React, { FC, useCallback } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';

import {
  Button,
  Form,
  Label,
  XStack,
  YStack,
  Text,
  Input,
  H6,
  Separator,
  Spinner,
} from 'tamagui';
import CreateProductCategory from '../../management/Addnewproduct/CreateProductCategory';
import { startCase } from 'lodash-es';
import { ServiceErrorManager } from '@/helpers/service';
import { ServiceChargeFormData } from '@/types/ServiceCharge';
import { FaSave } from 'react-icons/fa';
import { ListCategoriesService } from '@/services/categories';

const ServiceChargeForm: FC<{
  isEdit?: boolean;
  form: UseFormReturn<ServiceChargeFormData>;
  isSubmiting: boolean;
  onSubmit: (r: ServiceChargeFormData) => void;
}> = ({ isEdit = false, form, isSubmiting, onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;
  const getProductCategory = useCallback(
    async (search: string, type: string) => {
      const [_, data] = await ServiceErrorManager(
        ListCategoriesService(1, 50, search, type)(),
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
    <YStack padding='$4' space='$4'>
      <XStack justifyContent='space-between' alignItems='center'>
        <H6>{isEdit ? 'Edit Service Charge' : 'Create Service Charge'}</H6>
      </XStack>
      <Separator />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <YStack space='$4'>
          <YStack>
            <Label htmlFor='category'>Product Category *</Label>
            <Controller
              control={control}
              name='category'
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <AsyncSelect
                  menuChildren={({ reload }) => (
                    <CreateProductCategory reload={reload} type='category' />
                  )}
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
              <Text color='$red10' fontSize='$2'>
                {errors.category.message}
              </Text>
            )}
          </YStack>

          <YStack>
            <Label htmlFor='chargeType'>Charge Type *</Label>
            <Controller
              control={control}
              name='chargeType'
              rules={{ required: 'Charge type is required' }}
              render={({ field }) => (
                <AsyncSelect
                  {...field}
                  options={[
                    {
                      label: 'Percentage',
                      value: 'percentage',
                    },
                    {
                      label: 'Flat Fee',
                      value: 'flat',
                    },
                  ]}
                />
              )}
            />
            {errors.chargeType && (
              <Text color='$red10' fontSize='$2'>
                {errors.chargeType.message}
              </Text>
            )}
          </YStack>

          <YStack>
            <Label htmlFor='value'>
              <Controller
                control={control}
                name='chargeType'
                render={({ field }) => (
                  <Text>
                    {field.value === 'percentage' ? 'Percentage' : 'Amount'}{' '}
                    Value *
                  </Text>
                )}
              />
            </Label>
            <Controller
              control={control}
              name='value'
              rules={{
                required: 'Value is required',
                min: { value: 0, message: 'Value must be positive' },
                pattern: {
                  value: /^\d*\.?\d{0,2}$/,
                  message: 'Enter a valid number',
                },
              }}
              render={({ field }) => (
                <Input
                  id='value'
                  value={(field.value || '').toString()}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9.]/g, '');
                    field.onChange(parseFloat(cleaned) || 0);
                  }}
                  keyboardType='numeric'
                  placeholder='Enter value'
                />
              )}
            />
            {errors.value && (
              <Text color='$red10' fontSize='$2'>
                {errors.value.message}
              </Text>
            )}
          </YStack>

          <YStack>
            <Label htmlFor='minOrderValue'>Minimum Order Value</Label>
            <Controller
              control={control}
              name='minOrderValue'
              render={({ field }) => (
                <Input
                  id='minOrderValue'
                  value={(field.value || '')?.toString() || ''}
                  onChangeText={(text) =>
                    field.onChange(text ? parseFloat(text) : undefined)
                  }
                  keyboardType='numeric'
                  placeholder='Enter minimum order value (optional)'
                />
              )}
            />
          </YStack>

          <YStack>
            <Label htmlFor='applicableStates'>Applicable States</Label>
            <Controller
              control={control}
              name='applicableStates'
              render={({ field }) => (
                <Input
                  id='applicableStates'
                  value={field.value || ''}
                  onChangeText={field.onChange}
                  placeholder='Enter comma-separated states (e.g. NY, CA, TX)'
                />
              )}
            />
            <Text fontSize='$3' opacity={0.7} marginTop='$1'>
              Leave empty to apply to all states
            </Text>
          </YStack>

          <Button
            marginTop='$2'
            backgroundColor='$primary'
            size='$3'
            icon={isSubmiting ? <Spinner /> : <FaSave />}
            onPress={handleSubmit(onSubmit)}
          >
            {isEdit ? 'Update' : 'Save'}
          </Button>
        </YStack>
      </Form>
    </YStack>
  );
};

export default ServiceChargeForm;
