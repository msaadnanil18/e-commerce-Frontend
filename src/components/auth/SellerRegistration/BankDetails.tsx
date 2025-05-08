'use client';
import React, { FC } from 'react';
import { YStack, Text, XStack, Input, Separator } from 'tamagui';
import { Controller, UseFormReturn } from 'react-hook-form';

import { SellerFormData, validateRequired } from '.';

const BankDetails: FC<{
  form: UseFormReturn<SellerFormData>;
}> = ({ form }) => {
  const {
    control,
    formState: { errors },
  } = form;
  return (
    <YStack space='$4'>
      <Text fontWeight='bold' fontSize='$4' color='$blue10'>
        Bank Details
      </Text>
      <Separator />

      <XStack flexWrap='wrap' gap='$4'>
        <YStack flex={1} minWidth={250} space='$2'>
          <Text>Account Number *</Text>
          <Controller
            name='accountNumber'
            control={control}
            rules={{ validate: validateRequired }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Enter account number'
                borderColor={errors.accountNumber ? '$red10' : '$gray8'}
              />
            )}
          />
          {errors.accountNumber && (
            <Text fontSize='$2' color='$red10'>
              {errors.accountNumber.message}
            </Text>
          )}
        </YStack>

        <YStack flex={1} minWidth={250} space='$2'>
          <Text>IFSC Code *</Text>
          <Controller
            name='ifscCode'
            control={control}
            rules={{ validate: validateRequired }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Enter IFSC code'
                borderColor={errors.ifscCode ? '$red10' : '$gray8'}
              />
            )}
          />
          {errors.ifscCode && (
            <Text fontSize='$2' color='$red10'>
              {errors.ifscCode.message}
            </Text>
          )}
        </YStack>
      </XStack>

      <XStack flexWrap='wrap' gap='$4'>
        <YStack flex={1} minWidth={250} space='$2'>
          <Text>Bank Name *</Text>
          <Controller
            name='bankName'
            control={control}
            rules={{ validate: validateRequired }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Enter bank name'
                borderColor={errors.bankName ? '$red10' : '$gray8'}
              />
            )}
          />
          {errors.bankName && (
            <Text fontSize='$2' color='$red10'>
              {errors.bankName.message}
            </Text>
          )}
        </YStack>

        <YStack flex={1} minWidth={250} space='$2'>
          <Text>Account Holder Name *</Text>
          <Controller
            name='accountHolderName'
            control={control}
            rules={{ validate: validateRequired }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Enter account holder name'
                borderColor={errors.accountHolderName ? '$red10' : '$gray8'}
              />
            )}
          />
          {errors.accountHolderName && (
            <Text fontSize='$2' color='$red10'>
              {errors.accountHolderName.message}
            </Text>
          )}
        </YStack>
      </XStack>
    </YStack>
  );
};

export default BankDetails;
