'use client';
import React from 'react';
import { useForm, Controller, UseFormReturn } from 'react-hook-form';
import {
  Card,
  XStack,
  Text,
  Input,
  Form,
  Button,
  YStack,
  Spinner,
  Switch,
} from 'tamagui';
import { FiMapPin, FiSave } from 'react-icons/fi';
import { ServiceErrorManager } from '@/helpers/service';
import { AddressFormValues } from '@/types/address';

interface ShippingAddressFormProps {
  existingAddress?: AddressFormValues;
  onSave: (address: AddressFormValues) => Promise<void>;
  isLoading?: boolean;
  form: UseFormReturn<AddressFormValues>;
  onCancel?: () => void;
  onSaveButtonText?: string;
}

const ShippingAddressForm = ({
  isLoading,
  onSave,
  onSaveButtonText,
  form,
  onCancel,
}: ShippingAddressFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  // useForm<AddressFormValues>({
  //   defaultValues: {
  //     name: '', // Added
  //     street: '',
  //     city: '',
  //     state: '',
  //     postalCode: '',
  //     country: '',
  //     phoneNumber: '',
  //     landmark: '', // Added
  //     alternativePhone: '', // Added
  //     isDefault: false, // Added
  //   },
  // });

  const handleSubmitOrder = async (data: AddressFormValues) => {
    await onSave(data);
  };

  return (
    <YStack>
      <XStack space='$2' marginBottom='$3'>
        <FiMapPin size={16} />
        <Text fontSize='$3'>Shipping Address</Text>
      </XStack>

      <Form space onSubmit={handleSubmit(handleSubmitOrder)}>
        <YStack>
          <YStack spaceDirection='horizontal' gap='$2'>
            <Controller
              control={control}
              name='name'
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <Input
                  placeholder='Name'
                  value={field.value}
                  onChangeText={field.onChange}
                  borderColor={errors.name ? '$red8' : undefined}
                />
              )}
            />
            {errors.name && (
              <Text color='$red10' fontSize='$2'>
                {errors.name.message}
              </Text>
            )}

            <Controller
              control={control}
              name='street'
              rules={{ required: 'Street address is required' }}
              render={({ field }) => (
                <Input
                  placeholder='Street Address'
                  value={field.value}
                  onChangeText={field.onChange}
                  borderColor={errors.street ? '$red8' : undefined}
                />
              )}
            />
            {errors.street && (
              <Text color='$red10' fontSize='$2'>
                {errors.street.message}
              </Text>
            )}

            <XStack space='$2'>
              <YStack flex={1}>
                <Controller
                  control={control}
                  name='city'
                  rules={{ required: 'City is required' }}
                  render={({ field }) => (
                    <Input
                      placeholder='City'
                      value={field.value}
                      onChangeText={field.onChange}
                      borderColor={errors.city ? '$red8' : undefined}
                    />
                  )}
                />
                {errors.city && (
                  <Text color='$red10' fontSize='$2'>
                    {errors.city.message}
                  </Text>
                )}
              </YStack>

              <YStack width={100}>
                <Controller
                  control={control}
                  name='state'
                  rules={{ required: 'State is required' }}
                  render={({ field }) => (
                    <Input
                      placeholder='State'
                      value={field.value}
                      onChangeText={field.onChange}
                      borderColor={errors.state ? '$red8' : undefined}
                    />
                  )}
                />
                {errors.state && (
                  <Text color='$red10' fontSize='$2'>
                    {errors.state.message}
                  </Text>
                )}
              </YStack>
            </XStack>

            <XStack space='$2'>
              <YStack flex={1}>
                <Controller
                  control={control}
                  name='postalCode'
                  rules={{ required: 'ZIP Code is required' }}
                  render={({ field }) => (
                    <Input
                      placeholder='ZIP Code'
                      value={field.value}
                      onChangeText={field.onChange}
                      borderColor={errors.postalCode ? '$red8' : undefined}
                    />
                  )}
                />
                {errors.postalCode && (
                  <Text color='$red10' fontSize='$2'>
                    {errors.postalCode.message}
                  </Text>
                )}
              </YStack>

              <YStack flex={2}>
                <Controller
                  control={control}
                  name='country'
                  rules={{ required: 'Country is required' }}
                  render={({ field }) => (
                    <Input
                      placeholder='Country'
                      value={field.value}
                      onChangeText={field.onChange}
                      borderColor={errors.country ? '$red8' : undefined}
                    />
                  )}
                />
                {errors.country && (
                  <Text color='$red10' fontSize='$2'>
                    {errors.country.message}
                  </Text>
                )}
              </YStack>
            </XStack>

            <Controller
              control={control}
              name='phoneNumber'
              rules={{ required: 'Phone number is required' }}
              render={({ field }) => (
                <Input
                  placeholder='Phone Number'
                  value={field.value}
                  onChangeText={field.onChange}
                  borderColor={errors.phoneNumber ? '$red8' : undefined}
                />
              )}
            />
            {errors.phoneNumber && (
              <Text color='$red10' fontSize='$2'>
                {errors.phoneNumber.message}
              </Text>
            )}

            <Controller
              control={control}
              name='landmark'
              render={({ field }) => (
                <Input
                  placeholder='Landmark (Optional)'
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )}
            />

            <Controller
              control={control}
              name='alternativePhone'
              render={({ field }) => (
                <Input
                  placeholder='Alternative Phone (Optional)'
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )}
            />
            <XStack spaceDirection='vertical' gap='$4'>
              <Button
                size='$3'
                icon={isLoading ? <Spinner /> : <FiSave />}
                disabled={isLoading}
                themeInverse
                onPress={handleSubmit(handleSubmitOrder)}
              >
                {onSaveButtonText || 'SAVE ADDRESS'}
              </Button>
              {onCancel && (
                <Button
                  variant='outlined'
                  size='$3'
                  disabled={isLoading}
                  onPress={onCancel}
                >
                  CANCEL
                </Button>
              )}
            </XStack>
          </YStack>
        </YStack>
      </Form>
    </YStack>
  );
};

export default ShippingAddressForm;
