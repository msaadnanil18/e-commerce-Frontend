'use client';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaArrowDown, FaArrowUp, FaSave, FaTimes } from 'react-icons/fa';
import {
  Button,
  Input,
  Label,
  Select,
  Spinner,
  Switch,
  Text,
  XStack,
  YStack,
} from 'tamagui';

interface ProductCategory {
  _id?: string;
  title: string;
  type: string;
  displayOrder: number;
  isFeatured: boolean;
  featuredOrder: number;
  parent: string | null;
  level: number;
}

interface ProductCategoryFormProps {
  category?: ProductCategory;
  parentCategories?: ProductCategory[];
  onSubmit: (data: ProductCategory) => Promise<void>;
  onCancel: () => void;
}

const ProductCategoryForm: React.FC<ProductCategoryFormProps> = ({
  category,
  parentCategories = [],
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: ProductCategory = {
    title: '',
    type: 'standard',
    displayOrder: 0,
    isFeatured: false,
    featuredOrder: 0,
    parent: null,
    level: 1,
    ...category,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProductCategory>({
    defaultValues,
  });

  const parentValue = watch('parent');

  useEffect(() => {
    if (parentValue) {
      const parent = parentCategories.find((cat) => cat._id === parentValue);
      if (parent) {
        setValue('level', parent.level + 1);
      }
    } else {
      setValue('level', 1);
    }
  }, [parentValue, parentCategories, setValue]);

  const submitForm = async (data: ProductCategory) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Adjust display order
  const adjustOrder = (
    field: 'displayOrder' | 'featuredOrder',
    increment: number
  ) => {
    const currentValue = watch(field);
    setValue(field, Math.max(0, currentValue + increment));
  };

  return (
    <YStack padding='$4' space='$4'>
      <Text fontSize='$6' fontWeight='bold'>
        {category ? 'Edit Product Category' : 'New Product Category'}
      </Text>

      <YStack space='$4'>
        {/* Title */}
        <YStack space='$2'>
          <Label htmlFor='title'>Title</Label>
          <Controller
            name='title'
            control={control}
            rules={{ required: 'Title is required' }}
            render={({ field }) => (
              <Input
                id='title'
                placeholder='Category title'
                {...field}
                borderColor={errors.title ? '$red9' : undefined}
              />
            )}
          />
          {errors.title && (
            <Text color='$red9' fontSize='$2'>
              {errors.title.message}
            </Text>
          )}
        </YStack>

        <YStack space='$2'>
          <Label htmlFor='type'>Type</Label>
          <Controller
            name='type'
            control={control}
            rules={{ required: 'Type is required' }}
            render={({ field }) => (
              <Select
                id='type'
                value={field.value}
                onValueChange={field.onChange}
                //   borderColor={errors.type ? '$red9' : undefined}
              >
                <Select.Trigger>
                  <Select.Value placeholder='Select type' />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item index={0} value='standard'>
                    <Select.ItemText>Standard</Select.ItemText>
                  </Select.Item>
                  <Select.Item index={1} value='special'>
                    <Select.ItemText>Special</Select.ItemText>
                  </Select.Item>
                  <Select.Item index={2} value='seasonal'>
                    <Select.ItemText>Seasonal</Select.ItemText>
                  </Select.Item>
                </Select.Content>
              </Select>
            )}
          />
          {errors.type && (
            <Text color='$red9' fontSize='$2'>
              {errors.type.message}
            </Text>
          )}
        </YStack>

        <YStack space='$2'>
          <Label htmlFor='parent'>Parent Category</Label>
          <Controller
            name='parent'
            control={control}
            render={({ field }) => (
              <Select
                id='parent'
                value={field.value || ''}
                onValueChange={field.onChange}
              >
                <Select.Trigger>
                  <Select.Value placeholder='No parent (top level)' />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item index={0} value=''>
                    <Select.ItemText>No parent (top level)</Select.ItemText>
                  </Select.Item>
                  {parentCategories.map((category, index) => (
                    <Select.Item
                      key={category._id}
                      index={index + 1}
                      value={category._id || ''}
                      disabled={category._id === defaultValues._id} // Prevent self-reference
                    >
                      <Select.ItemText>
                        {'—'.repeat(category.level)} {category.title}
                      </Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            )}
          />
        </YStack>

        <YStack space='$2'>
          <Label htmlFor='displayOrder'>Display Order</Label>
          <XStack alignItems='center' space='$2'>
            <Controller
              name='displayOrder'
              control={control}
              render={({ field }) => (
                <Input
                  id='displayOrder'
                  flex={1}
                  keyboardType='numeric'
                  value={field.value.toString()}
                  onChangeText={(text) => {
                    const value = parseInt(text) || 0;
                    field.onChange(value);
                  }}
                />
              )}
            />
            <Button
              icon={<FaArrowUp />}
              onPress={() => adjustOrder('displayOrder', -1)}
              size='$3'
            />
            <Button
              icon={<FaArrowDown />}
              onPress={() => adjustOrder('displayOrder', 1)}
              size='$3'
            />
          </XStack>
        </YStack>

        <XStack space='$2' alignItems='center'>
          <Label htmlFor='isFeatured'>Featured Category</Label>
          <Controller
            name='isFeatured'
            control={control}
            render={({ field: { value, onChange } }) => (
              <Switch
                id='isFeatured'
                checked={value}
                onCheckedChange={onChange}
              />
            )}
          />
        </XStack>

        {watch('isFeatured') && (
          <YStack space='$2'>
            <Label htmlFor='featuredOrder'>Featured Order</Label>
            <XStack alignItems='center' space='$2'>
              <Controller
                name='featuredOrder'
                control={control}
                render={({ field }) => (
                  <Input
                    id='featuredOrder'
                    flex={1}
                    keyboardType='numeric'
                    value={field.value.toString()}
                    onChangeText={(text) => {
                      const value = parseInt(text) || 0;
                      field.onChange(value);
                    }}
                  />
                )}
              />
              <Button
                icon={<FaArrowUp />}
                onPress={() => adjustOrder('featuredOrder', -1)}
                size='$3'
              />
              <Button
                icon={<FaArrowDown />}
                onPress={() => adjustOrder('featuredOrder', 1)}
                size='$3'
              />
            </XStack>
          </YStack>
        )}

        <YStack space='$2'>
          <Label htmlFor='level'>Hierarchy Level</Label>
          <Controller
            name='level'
            control={control}
            render={({ field }) => (
              <Input
                id='level'
                value={field.value.toString()}
                editable={false}
                opacity={0.7}
              />
            )}
          />
        </YStack>

        <XStack space='$4' justifyContent='flex-end' marginTop='$4'>
          <Button onPress={onCancel} icon={<FaTimes />} variant='outlined'>
            Cancel
          </Button>
          <Button
            onPress={handleSubmit(submitForm)}
            icon={isSubmitting ? <Spinner /> : <FaSave />}
            disabled={isSubmitting}
            backgroundColor='$blue9'
            color='white'
          >
            {isSubmitting ? 'Saving...' : 'Save Category'}
          </Button>
        </XStack>
      </YStack>
    </YStack>
  );
};

export default ProductCategoryForm;
