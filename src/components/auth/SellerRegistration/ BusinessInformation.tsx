'use client';
import React, { FC } from 'react';
import { YStack, Text, XStack, Input, Separator } from 'tamagui';
import { Controller, UseFormReturn } from 'react-hook-form';
import { SellerFormData, validateRequired } from '.';

const BusinessInformation: FC<{
  form: UseFormReturn<SellerFormData>;
}> = ({ form }) => {
  const validateGST = (value: string) => {
    return value.length >= 15 ? true : 'Please enter a valid GST number';
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(value) ? true : 'Please enter a valid email address';
  };

  const validatePhone = (value: string) => {
    return value.length >= 10 ? true : 'Please enter a valid phone number';
  };

  return (
    <YStack space='$4'>
      <Text fontWeight='bold' fontSize='$4' color='$blue10'>
        Business Information
      </Text>
      <Separator />

      <XStack flexWrap='wrap' gap='$4'>
        <YStack flex={1} minWidth={250} space='$2'>
          <Text>Business Name *</Text>
          <Controller
            name='businessName'
            control={form.control}
            rules={{ validate: validateRequired }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Enter your business name'
                borderColor={
                  form.formState.errors.businessName ? '$red10' : '$gray8'
                }
              />
            )}
          />
          {form.formState.errors.businessName && (
            <Text color='$red10'>
              {form.formState.errors.businessName.message}
            </Text>
          )}
        </YStack>

        <YStack flex={1} minWidth={250} space='$2'>
          <Text>GST Number *</Text>
          <Controller
            name='gstNumber'
            control={form.control}
            rules={{ validate: validateGST }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Enter your GST number'
                borderColor={
                  form.formState.errors.gstNumber ? '$red10' : '$gray8'
                }
              />
            )}
          />
          {form.formState.errors.gstNumber && (
            <Text fontSize='$3' color='$red10'>
              {form.formState.errors.gstNumber.message}
            </Text>
          )}
        </YStack>
      </XStack>

      <XStack flexWrap='wrap' gap='$4'>
        <YStack flex={1} minWidth={250} space='$2'>
          <Text>Email *</Text>
          <Controller
            name='contactEmail'
            control={form.control}
            rules={{ validate: validateEmail }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Enter contact email'
                borderColor={
                  form.formState.errors.contactEmail ? '$red10' : '$gray8'
                }
              />
            )}
          />
          {form.formState.errors.contactEmail && (
            <Text fontSize='$3' color='$red10'>
              {form.formState.errors.contactEmail.message}
            </Text>
          )}
        </YStack>

        <YStack flex={1} minWidth={250} space='$2'>
          <Text>Phone *</Text>
          <Controller
            name='contactPhone'
            control={form.control}
            rules={{ validate: validatePhone }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Enter contact phone'
                borderColor={
                  form.formState.errors.contactPhone ? '$red10' : '$gray8'
                }
              />
            )}
          />
          {form.formState.errors.contactPhone && (
            <Text fontSize='$3' color='$red10'>
              {form.formState.errors.contactPhone.message}
            </Text>
          )}
        </YStack>
      </XStack>
    </YStack>
  );
};

export default BusinessInformation;
