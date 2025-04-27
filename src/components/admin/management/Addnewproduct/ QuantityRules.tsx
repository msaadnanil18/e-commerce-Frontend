import { Product } from '@/types/products';
import React from 'react';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import {
  Separator,
  SizableText,
  XStack,
  YStack,
  Text,
  Input,
  Button,
} from 'tamagui';

const QuantityRules = ({ form }: { form: UseFormReturn<Product> }) => {
  const {
    control,
    formState: { errors },
  } = form;
  const {
    fields: predefinedFields,
    append: appendPredefined,
    remove: removePredefined,
  } = useFieldArray({
    control,
    //@ts-ignore
    name: 'quantityRules.predefined',
  });
  return (
    <YStack space='$4'>
      <SizableText size='$5' fontWeight='bold' marginTop='$4'>
        Quantity Rules
      </SizableText>
      <Separator />

      <XStack space='$3' flexWrap='wrap'>
        <YStack space='$2' flex={1} minWidth={150}>
          <Text>Minimum Quantity *</Text>
          <Controller
            name='quantityRules.min'
            control={control}
            rules={{
              required: 'Min quantity is required',
              min: {
                value: 1,
                message: 'Min quantity must be at least 1',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Min'
                inputMode='numeric'
                keyboardType='numeric'
                value={(field.value || '').toString()}
                onChangeText={(value) => field.onChange(parseInt(value) || 1)}
                borderColor={errors.quantityRules?.min ? '$red10' : undefined}
              />
            )}
          />
          {errors.quantityRules?.min && (
            <Text color='$red10'>{errors.quantityRules.min.message}</Text>
          )}
        </YStack>

        <YStack space='$2' flex={1} minWidth={150}>
          <Text>Maximum Quantity *</Text>
          <Controller
            name='quantityRules.max'
            control={control}
            rules={{
              required: 'Max quantity is required',
              validate: (value, formValues) =>
                value >= formValues.quantityRules.min ||
                'Max must be greater than or equal to min',
            }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Max'
                inputMode='numeric'
                keyboardType='numeric'
                value={(field.value || '').toString()}
                onChangeText={(value) => field.onChange(parseInt(value) || 1)}
                borderColor={errors.quantityRules?.max ? '$red10' : undefined}
              />
            )}
          />
          {errors.quantityRules?.max && (
            <Text color='$red10'>{errors.quantityRules.max.message}</Text>
          )}
        </YStack>

        <YStack space='$2' flex={1} minWidth={150}>
          <Text>Step Size</Text>
          <Controller
            name='quantityRules.step'
            control={control}
            rules={{
              min: { value: 1, message: 'Step must be at least 1' },
            }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Step'
                inputMode='numeric'
                keyboardType='numeric'
                value={(field.value || '').toString()}
                onChangeText={(value) => field.onChange(parseInt(value) || 1)}
              />
            )}
          />
        </YStack>
      </XStack>

      <YStack space='$3'>
        <Text fontWeight='bold'>Predefined Quantities</Text>

        {predefinedFields.map((field, index) => (
          <XStack
            key={field.id}
            space='$2'
            marginBottom='$3'
            alignItems='center'
          >
            <Controller
              name={`quantityRules.predefined.${index}`}
              control={control}
              render={({ field }) => (
                <Input
                  flex={1}
                  {...field}
                  inputMode='numeric'
                  keyboardType='numeric'
                  value={(field.value || '').toString()}
                  onChangeText={(value) => field.onChange(parseInt(value) || 0)}
                />
              )}
            />
            <Button
              size='$2'
              icon={<FiTrash2 size={16} />}
              onPress={() => removePredefined(index)}
            />
          </XStack>
        ))}

        <Button
          icon={<FiPlus size={16} />}
          onPress={() => {
            appendPredefined(1);
          }}
        >
          Add Predefined Quantities
        </Button>
      </YStack>
    </YStack>
  );
};

export default QuantityRules;
