import AsyncSelect from '@/components/appComponets/select/AsyncSelect';
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
  const [distcountType, setDiscountType] = React.useState<string | null>(null);
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

  const {
    fields: discountTiersFields,
    append: appendDiscountTiers,
    remove: removeDiscountTiers,
  } = useFieldArray({
    control,
    // @ts-ignore
    name: 'quantityRules.discountTiers',
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

        {!form.watch('quantityRules').predefined.length && (
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
        )}
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
      <YStack space='$3'>
        <Text fontWeight='bold'>Discount Tiers</Text>

        {discountTiersFields.map((field, index) => (
          <XStack
            key={field.id}
            space='$2'
            marginBottom='$3'
            alignItems='center'
          >
            <YStack space='$2' flex={1} minWidth={150}>
              <Text>Quantity </Text>
              <Controller
                name={`quantityRules.discountTiers.${index}.quantity`}
                control={control}
                render={({ field }) => (
                  <Input
                    flex={1}
                    {...field}
                    placeholder='Enter Discount Tiers Quantity'
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
            <YStack space='$2' flex={1} minWidth={150}>
              <Text>Select Discount Type </Text>
              <AsyncSelect
                marginBottom={0}
                options={[
                  { label: 'Discount Percentage', value: 'percentage' },
                  { label: 'Flat Discount', value: 'flat' },
                ]}
                onChange={(value) => setDiscountType(value)}
                value={distcountType ?? undefined}
                placeholder='Select Discount Type'
              />
            </YStack>
            {distcountType && distcountType === 'percentage' ? (
              <YStack space='$2' flex={1} minWidth={150}>
                <Text>Discount Percentage </Text>
                <Controller
                  name={`quantityRules.discountTiers.${index}.discountPercentage`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      flex={1}
                      {...field}
                      placeholder='Enter Discount Percentage'
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
            ) : distcountType && distcountType === 'flat' ? (
              <YStack space='$2' flex={1} minWidth={150}>
                <Text>Flat Discount </Text>
                <Controller
                  name={`quantityRules.discountTiers.${index}.flatDiscount`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      flex={1}
                      {...field}
                      placeholder='Enter Flat Discount'
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
            ) : null}

            <Button
              size='$2'
              marginTop='$5'
              icon={<FiTrash2 size={16} />}
              onPress={() => removeDiscountTiers(index)}
            />
          </XStack>
        ))}

        <Button
          icon={<FiPlus size={16} />}
          onPress={() => {
            appendDiscountTiers({
              quantity: 0,
              discountPercentage: 0,
              flatDiscount: 0,
            });
          }}
        >
          Add Discount Tiers
        </Button>
      </YStack>
    </YStack>
  );
};

export default QuantityRules;
