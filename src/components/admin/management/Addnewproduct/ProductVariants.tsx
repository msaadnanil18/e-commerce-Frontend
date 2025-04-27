import React, { memo } from 'react';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import {
  Card,
  XStack,
  YStack,
  Text,
  Button,
  Input,
  Checkbox,
  Separator,
  SizableText,
} from 'tamagui';
import CustomAttributesDetails from './CustomAttributesDetails';
import { FaCheck } from 'react-icons/fa';
import { Product } from '@/types/products';
import FileUpload from '@/components/appComponets/fileupload/FileUpload';

const ProductVariants = ({ form }: { form: UseFormReturn<Product> }) => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = form;
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: 'variants',
  });

  const variants = watch('variants');

  const calculateOriginalPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  return (
    <YStack space='$4'>
      <SizableText size='$5' fontWeight='bold' marginTop='$4'>
        Product Variants
      </SizableText>
      <Separator />
      {variantFields.map((field, index) => (
        <Card key={field.id} bordered padding='$3' marginVertical='$2'>
          <YStack space='$3'>
            <XStack justifyContent='space-between' alignItems='center'>
              <Text fontWeight='bold'>Variant {index + 1}</Text>
              {variantFields.length > 1 && (
                <Button
                  size='$2'
                  icon={<FiTrash2 size={16} />}
                  onPress={() => removeVariant(index)}
                />
              )}
            </XStack>

            <YStack space='$2'>
              <Text>Variant Name *</Text>
              <Controller
                name={`variants.${index}.variantName`}
                control={control}
                rules={{
                  required: 'Variant Name is required',
                  validate: (value) => {
                    const wordCount = value.trim().split(/\s+/).length;
                    return wordCount <= 20 || 'Maximum 20 words allowed';
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder='Enter Variant Name'
                    borderColor={
                      errors.variants?.[index]?.variantName
                        ? '$red10'
                        : undefined
                    }
                    onChangeText={(text) => {
                      const words = text.trim().split(/\s+/);
                      if (words.length <= 20) {
                        field.onChange(text);
                      }
                    }}
                  />
                )}
              />
              {errors.variants?.[index]?.variantName && (
                <Text color='$red10'>
                  {errors.variants[index].variantName?.message}
                </Text>
              )}
            </YStack>

            <YStack space='$2'>
              <Text>SKU *</Text>
              <Controller
                name={`variants.${index}.sku`}
                control={control}
                rules={{ required: 'SKU is required' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder='Enter SKU'
                    borderColor={
                      errors.variants?.[index]?.sku ? '$red10' : undefined
                    }
                  />
                )}
              />
              {errors.variants?.[index]?.sku && (
                <Text color='$red10'>
                  {errors.variants[index].sku?.message}
                </Text>
              )}
            </YStack>

            <YStack space='$2'>
              <Text>Price *</Text>
              <Controller
                name={`variants.${index}.price`}
                control={control}
                rules={{
                  required: 'Price is required',
                  min: {
                    value: 0,
                    message: 'Price must be positive',
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder='Enter price'
                    inputMode='decimal'
                    keyboardType='numeric'
                    value={(field.value || '').toString()}
                    onChangeText={(value) => {
                      const price = parseFloat(value) || 0;
                      field.onChange(price);
                      const discount = variants[index].discount || 0;
                      const originalPrice = calculateOriginalPrice(
                        price,
                        discount
                      );
                      setValue(
                        `variants.${index}.originalPrice`,
                        originalPrice
                      );
                    }}
                    borderColor={
                      errors.variants?.[index]?.price ? '$red10' : undefined
                    }
                  />
                )}
              />
              {errors.variants?.[index]?.price && (
                <Text color='$red10'>
                  {errors.variants[index].price?.message}
                </Text>
              )}
            </YStack>

            <YStack space='$2'>
              <Text>Discount (%)</Text>
              <Controller
                name={`variants.${index}.discount`}
                control={control}
                rules={{
                  min: {
                    value: 0,
                    message: 'Discount must be positive',
                  },
                  max: {
                    value: 100,
                    message: 'Discount cannot exceed 100%',
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder='Enter discount percentage'
                    inputMode='numeric'
                    keyboardType='numeric'
                    value={(field.value || '').toString()}
                    onChangeText={(value) => {
                      const discount = parseFloat(value) || 0;
                      field.onChange(discount);
                      const price = variants[index].price || 0;
                      const originalPrice = calculateOriginalPrice(
                        price,
                        discount
                      );
                      setValue(
                        `variants.${index}.originalPrice`,
                        originalPrice
                      );
                    }}
                  />
                )}
              />
            </YStack>

            <YStack space='$2'>
              <Text>Original Price</Text>
              <Controller
                name={`variants.${index}.originalPrice`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder='Original Price'
                    inputMode='decimal'
                    keyboardType='numeric'
                    value={(field.value || '').toString()}
                    disabled
                  />
                )}
              />
            </YStack>

            <YStack space='$2'>
              <Text>Inventory</Text>
              <Controller
                name={`variants.${index}.inventory`}
                control={control}
                rules={{
                  min: {
                    value: 0,
                    message: 'Inventory must be positive',
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder='Enter inventory quantity'
                    inputMode='numeric'
                    keyboardType='numeric'
                    value={(field.value || '').toString()}
                    onChangeText={(value) =>
                      field.onChange(parseInt(value) || 0)
                    }
                  />
                )}
              />
            </YStack>

            <YStack space='$2'>
              <Text>
                Media{' '}
                <Text fontSize='$3'>
                  (Upload Photos, Videos, or Other Files)
                </Text>
              </Text>
              <FileUpload
                form={form}
                multiple
                accept={[
                  '.jpg',
                  '.jpeg',
                  '.png',
                  '.gif',
                  '.svg',
                  '.webp',
                  '.mp4',
                ]}
                name={`variants.${index}.media`}
              />
            </YStack>

            <YStack space='$2'>
              <Text fontWeight='bold'>Custom Details Attributes</Text>
              <Separator marginBottom='$2' />
              <CustomAttributesDetails control={control} index={index} />
            </YStack>

            <YStack space='$2'>
              <Controller
                name={`variants.${index}.isMadeOnDemand`}
                control={control}
                render={({ field }) => (
                  <XStack alignItems='center' space='$2'>
                    <Checkbox
                      id={`variants.${index}.isMadeOnDemand`}
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(!!checked);
                      }}
                    >
                      <Checkbox.Indicator>
                        <FaCheck />
                      </Checkbox.Indicator>
                    </Checkbox>
                    <Text htmlFor={`variants.${index}.isMadeOnDemand`}>
                      Made on Demand
                    </Text>
                  </XStack>
                )}
              />
            </YStack>

            <YStack space='$2'>
              <Text>Shipping Timeline</Text>
              <Controller
                name={`variants.${index}.shippingTimeline`}
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder='e.g. 3-5 business days' />
                )}
              />
            </YStack>
          </YStack>
        </Card>
      ))}

      <Button
        icon={<FiPlus size={16} />}
        onPress={() =>
          appendVariant({
            variantName: '',
            sku: '',
            price: 0,
            discount: 0,
            originalPrice: 0,
            attributes: [],
            media: [],
            inventory: 0,
            isMadeOnDemand: false,
            shippingTimeline: '',
          })
        }
      >
        Add Variant
      </Button>
    </YStack>
  );
};

export default memo(ProductVariants);
