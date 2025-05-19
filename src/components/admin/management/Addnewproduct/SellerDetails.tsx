import { Product } from '@/types/products';
import { Controller, UseFormReturn } from 'react-hook-form';
import { FaCheck } from 'react-icons/fa';
import {
  Checkbox,
  Input,
  Separator,
  SizableText,
  Text,
  XStack,
  YStack,
} from 'tamagui';
import Attachments from './Attachments';

const SellerDetails = ({ form }: { form: UseFormReturn<Product> }) => {
  const {
    control,
    formState: { errors },
  } = form;
  return (
    <YStack space='$4'>
      <SizableText size='$5' fontWeight='bold' marginTop='$4'>
        Manufacturing Details
      </SizableText>
      <Separator />
      <YStack space='$2'>
        <Text>Manufacturer</Text>
        <Controller
          name='sellerSpecificDetails.manufacturer'
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder='Enter manufacturer details' />
          )}
        />
      </YStack>
      <YStack space='$2'>
        <Text>Brand</Text>
        <Controller
          name='sellerSpecificDetails.brand'
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder='Enter brand details' />
          )}
        />
      </YStack>
      <YStack space='$2'>
        <Text>Packaging Details</Text>
        <Controller
          name='sellerSpecificDetails.packaging'
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder='Enter packaging details' />
          )}
        />
      </YStack>

      <YStack space='$2'>
        <Text>Service Terms</Text>
        <Controller
          name='sellerSpecificDetails.serviceTerms'
          control={control}
          render={({ field }) => (
            <Input
              multiline
              numberOfLines={3}
              {...field}
              placeholder='Enter service terms'
            />
          )}
        />
      </YStack>

      <XStack spaceDirection='vertical' gap='$10'>
        <Attachments form={form} />
        <YStack space='$2' paddingLeft='$2'>
          <Text fontWeight='bold'>Payment Options</Text>
          <Controller
            name='sellerSpecificDetails.paymentOptions.immediatePayment'
            control={control}
            render={({ field }) => (
              <XStack alignItems='center' space='$2'>
                <Checkbox
                  onCheckedChange={(checked) => {
                    field.onChange(!!checked);
                  }}
                  id={'immediatePayment'}
                  size='$4'
                  checked={field.value}
                >
                  <Checkbox.Indicator>
                    <FaCheck />
                  </Checkbox.Indicator>
                </Checkbox>
                <Text htmlFor='immediatePayment'>Immediate Payment</Text>
              </XStack>
            )}
          />

          <Controller
            name='sellerSpecificDetails.paymentOptions.deferredPayment'
            control={control}
            render={({ field }) => (
              <XStack alignItems='center' space='$2'>
                <Checkbox
                  onCheckedChange={(checked) => {
                    field.onChange(!!checked);
                  }}
                  id={'deferredPayment'}
                  size='$4'
                  checked={field.value}
                >
                  <Checkbox.Indicator>
                    <FaCheck />
                  </Checkbox.Indicator>
                </Checkbox>

                <Text htmlFor='deferredPayment'>Deferred Payment</Text>
              </XStack>
            )}
          />
        </YStack>
      </XStack>
    </YStack>
  );
};

export default SellerDetails;
