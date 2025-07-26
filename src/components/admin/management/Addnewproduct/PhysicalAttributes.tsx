import AsyncSelect from '@/components/appComponets/select/AsyncSelect';
import { Product } from '@/types/products';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Separator, SizableText, YStack, Text, Input, XStack } from 'tamagui';

const PhysicalAttributes = ({ form }: { form: UseFormReturn<Product> }) => {
  const {
    control,
    formState: { errors },
  } = form;
  return (
    <YStack space='$4'>
      <SizableText size='$5' fontWeight='bold' marginTop='$4'>
        Physical Attributes
      </SizableText>
      <Separator />

      <YStack space='$10' flex={1} flexDirection='row'>
        <YStack space='$2'>
          <Text>Weight *</Text>
          <Controller
            name='physicalAttributes.weight'
            control={control}
            rules={{
              required: 'Weight is required',
              min: { value: 0, message: 'Weight must be positive' },
            }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Enter weight'
                inputMode='decimal'
                keyboardType='numeric'
                value={(field.value || '').toString()}
                onChangeText={(value) => field.onChange(value || 0)}
                borderColor={
                  errors.physicalAttributes?.weight ? '$red10' : undefined
                }
              />
            )}
          />
          {errors.physicalAttributes?.weight && (
            <Text color='$red10'>
              {errors.physicalAttributes.weight.message}
            </Text>
          )}
        </YStack>
        <YStack space='$2'>
          <Text>Weight Unit *</Text>
          <Controller
            name='physicalAttributes.weightUnit'
            control={control}
            rules={{
              required: 'weight unit is required',
              min: { value: 0, message: 'Weight must be positive' },
            }}
            render={({ field }) => (
              <AsyncSelect
                {...field}
                options={[
                  {
                    label: 'kilogram',
                    value: 'kilogram',
                  },
                  {
                    label: 'Gram',
                    value: 'gram',
                  },
                ]}
              />
            )}
          />
          {errors.physicalAttributes?.weightUnit && (
            <Text color='$red10'>
              {errors.physicalAttributes.weightUnit.message}
            </Text>
          )}
        </YStack>
      </YStack>

      <Text fontWeight='bold'>Dimensions *</Text>
      <XStack space='$3' flexWrap='wrap'>
        <YStack space='$2' flex={1} minWidth={100}>
          <Text>Length</Text>
          <Controller
            name='physicalAttributes.dimensions.length'
            control={control}
            rules={{
              required: 'Length is required',
              min: { value: 0, message: 'Length must be positive' },
            }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Length'
                inputMode='decimal'
                keyboardType='numeric'
                value={(field.value || '').toString()}
                onChangeText={(value) => field.onChange(value || 0)}
                borderColor={
                  errors.physicalAttributes?.dimensions?.length
                    ? '$red10'
                    : undefined
                }
              />
            )}
          />
          {errors.physicalAttributes?.dimensions?.length && (
            <Text color='$red10'>
              {errors.physicalAttributes.dimensions.length.message}
            </Text>
          )}
        </YStack>

        <YStack space='$2' flex={1} minWidth={100}>
          <Text>Width </Text>
          <Controller
            name='physicalAttributes.dimensions.width'
            control={control}
            rules={{
              required: 'Width is required',
              min: { value: 0, message: 'Width must be positive' },
            }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Width'
                inputMode='decimal'
                keyboardType='numeric'
                value={(field.value || '').toString()}
                onChangeText={(value) => field.onChange(value || 0)}
                borderColor={
                  errors.physicalAttributes?.dimensions?.width
                    ? '$red10'
                    : undefined
                }
              />
            )}
          />
          {errors.physicalAttributes?.dimensions?.width && (
            <Text color='$red10'>
              {errors.physicalAttributes.dimensions.width.message}
            </Text>
          )}
        </YStack>

        <YStack space='$2' flex={1} minWidth={100}>
          <Text>Height </Text>
          <Controller
            name='physicalAttributes.dimensions.height'
            control={control}
            rules={{
              required: 'Height is required',
              min: { value: 0, message: 'Height must be positive' },
            }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Height'
                inputMode='decimal'
                keyboardType='numeric'
                value={(field.value || '').toString()}
                onChangeText={(value) => field.onChange(value || 0)}
                borderColor={
                  errors.physicalAttributes?.dimensions?.height
                    ? '$red10'
                    : undefined
                }
              />
            )}
          />
          {errors.physicalAttributes?.dimensions?.height && (
            <Text color='$red10'>
              {errors.physicalAttributes.dimensions.height.message}
            </Text>
          )}
        </YStack>

        <YStack space='$2' flex={1} minWidth={100}>
          <Text>Dimension Unit </Text>
          <Controller
            name='physicalAttributes.dimensions.dimensionUnit'
            control={control}
            rules={{
              required: 'dimensionUnit is required',
            }}
            render={({ field }) => (
              <AsyncSelect
                options={[
                  { value: 'centimeter', label: 'Centimeter' },
                  { label: 'Meter', value: 'meter' },
                  { label: 'Inch', value: 'inch' },
                  { label: 'Feet', value: 'feet' },
                ]}
                {...field}
              />
            )}
          />
          {errors.physicalAttributes?.dimensions?.dimensionUnit && (
            <Text color='$red10'>
              {errors.physicalAttributes.dimensions.dimensionUnit.message}
            </Text>
          )}
        </YStack>
      </XStack>
    </YStack>
  );
};

export default PhysicalAttributes;
