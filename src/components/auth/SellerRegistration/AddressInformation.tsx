'use client';
import React, { FC } from 'react';
import { YStack, Text, XStack, Input, Separator } from 'tamagui';
import { Controller, UseFormReturn } from 'react-hook-form';
import {
  SellerFormData,
  validateRequired,
} from '@/app/seller-registration/page';

const AddressInformation: FC<{
  form: UseFormReturn<SellerFormData>;
}> = ({ form }) => {
  const {
    control,
    formState: { errors },
  } = form;
  return (
    <YStack space='$4'>
      <Text fontWeight='bold' fontSize='$4' color='$blue10'>
        Address Information
      </Text>
      <Separator />

      <YStack space='$2'>
        <Text>Street Address *</Text>
        <Controller
          name='street'
          control={control}
          rules={{ validate: validateRequired }}
          render={({ field }) => (
            <Input
              {...field}
              placeholder='Enter street address'
              borderColor={errors.street ? '$red10' : '$gray8'}
            />
          )}
        />
        {errors.street && (
          <Text fontSize='$3' color='$red10'>
            {errors.street.message}
          </Text>
        )}
      </YStack>

      <XStack flexWrap='wrap' gap='$4'>
        <YStack flex={1} minWidth={250} space='$2'>
          <Text>City *</Text>
          <Controller
            name='city'
            control={control}
            rules={{ validate: validateRequired }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Enter city'
                borderColor={errors.city ? '$red10' : '$gray8'}
              />
            )}
          />
          {errors.city && (
            <Text fontSize='$3' color='$red10'>
              {errors.city.message}
            </Text>
          )}
        </YStack>

        <YStack flex={1} minWidth={250} space='$2'>
          <Text>State *</Text>
          <Controller
            name='state'
            control={control}
            rules={{ validate: validateRequired }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Enter state'
                borderColor={errors.state ? '$red10' : '$gray8'}
              />
            )}
          />
          {errors.state && (
            <Text fontSize='$3' color='$red10'>
              {errors.state.message}
            </Text>
          )}
        </YStack>
      </XStack>

      <XStack flexWrap='wrap' gap='$4'>
        <YStack flex={1} minWidth={250} space='$2'>
          <Text>Country *</Text>
          <Controller
            name='country'
            control={control}
            rules={{ validate: validateRequired }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Enter country'
                borderColor={errors.country ? '$red10' : '$gray8'}
              />
            )}
          />
          {errors.country && (
            <Text fontSize='$3' color='$red10'>
              {errors.country.message}
            </Text>
          )}
        </YStack>

        <YStack flex={1} minWidth={250} space='$2'>
          <Text>Postal Code *</Text>
          <Controller
            name='postalCode'
            control={control}
            rules={{ validate: validateRequired }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Enter postal code'
                borderColor={errors.postalCode ? '$red10' : '$gray8'}
              />
            )}
          />
          {errors.postalCode && (
            <Text fontSize='$3' color='$red10'>
              {errors.postalCode.message}
            </Text>
          )}
        </YStack>
      </XStack>
    </YStack>
  );
};

export default AddressInformation;
