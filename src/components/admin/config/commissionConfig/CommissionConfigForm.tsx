import { FC, useCallback, useState } from 'react';
import { useForm, Controller, UseFormReturn } from 'react-hook-form';
import {
  View,
  Text,
  Button,
  XStack,
  YStack,
  Form,
  Input,
  Separator,
  Switch,
  Card,
  Label,
  H6,
  Spinner,
} from 'tamagui';
import {
  FiPercent,
  FiPlus,
  FiTrash2,
  FiSave,
  FiRotateCcw,
} from 'react-icons/fi';
import { ServiceErrorManager } from '@/helpers/service';
import { ListService } from '@/services/crud';
import { startCase } from 'lodash-es';
import AsyncSelect from '@/components/appComponets/select/AsyncSelect';
import CreateProductCategory from '../../management/Addnewproduct/CreateProductCategory';
import { ICommissionConfigForm } from '@/types/Commission';

const CommissionConfigForm: FC<{
  isEdit?: boolean;
  form: UseFormReturn<ICommissionConfigForm>;
  isSubmitting: boolean;
  onSubmit: (r: ICommissionConfigForm) => void;
}> = ({ isEdit = false, form, isSubmitting, onSubmit }) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = form;

  const commissionType = watch('commissionType');
  const tiers: any = watch('tiers');

  const addTier = () => {
    const lastTier = tiers[tiers.length - 1];
    const newMinAmount = lastTier?.maxAmount || lastTier?.minAmount || 0;
    const newTier = {
      minAmount: newMinAmount,
      commissionValue: 0,
      commissionType: 'percentage' as const,
    };

    const newTiers = [...tiers, newTier];
    reset({ ...watch(), tiers: newTiers });
  };

  const removeTier = (index: number) => {
    const newTiers = tiers.filter((_: any, i: any) => i !== index);
    reset({ ...watch(), tiers: newTiers });
  };

  const getProductCategory = useCallback(
    async (search: string, type: string) => {
      const [_, data] = await ServiceErrorManager(
        ListService({
          data: {
            schema: 'Productcategory',
            options: {
              limit: 50,
            },
            query: {
              type,
              ...(search ? { search } : {}),
              searchFields: ['title'],
            },
          },
        }),
        {
          failureMessage: 'Error while getting product category list',
        }
      );
      return (data.docs || []).map((category: any) => ({
        label: startCase(category?.title),
        value: category?._id,
      }));
    },
    []
  );

  return (
    <YStack padding='$4' space='$4'>
      <YStack space='$4'>
        <XStack justifyContent='space-between' alignItems='center'>
          <H6>
            {isEdit
              ? 'Edit Commission Configuration'
              : 'Create Commission Configuration'}
          </H6>
        </XStack>
        <Separator marginVertical='$2' />

        <Form onSubmit={handleSubmit(onSubmit)}>
          <YStack space='$5'>
            <YStack space='$2'>
              <Label htmlFor='category'>Product Category</Label>
              <Controller
                name='category'
                control={control}
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <AsyncSelect
                    menuChildren={({ reload }) => (
                      <CreateProductCategory reload={reload} type='category' />
                    )}
                    searchable={true}
                    loadOptions={(searchQuery) =>
                      getProductCategory(searchQuery, 'category')
                    }
                    isAsync={true}
                    {...field}
                  />
                )}
              />
              {errors.category && (
                <Text color='$red10' fontSize='$2'>
                  {errors.category.message}
                </Text>
              )}
            </YStack>

            <YStack space='$2'>
              <Label htmlFor='commissionType'>Commission Type</Label>
              <Controller
                name='commissionType'
                control={control}
                render={({ field }) => (
                  <AsyncSelect
                    {...field}
                    options={[
                      {
                        label: 'Percentage',
                        value: 'percentage',
                      },
                      {
                        label: 'Fixed Amount',
                        value: 'fixed',
                      },
                      {
                        label: 'Tiered',
                        value: 'tiered',
                      },
                    ]}
                  />
                )}
              />
            </YStack>

            {(commissionType === 'percentage' ||
              commissionType === 'fixed') && (
              <YStack space='$2'>
                <Label htmlFor='value'>
                  {commissionType === 'percentage'
                    ? 'Percentage Rate'
                    : 'Fixed Amount'}
                </Label>
                <XStack alignItems='center'>
                  <Controller
                    name='value'
                    control={control}
                    rules={{
                      required: 'Value is required',
                      min: {
                        value: 0,
                        message: 'Value must be positive',
                      },
                      max:
                        commissionType === 'percentage'
                          ? {
                              value: 100,
                              message: 'Percentage cannot exceed 100%',
                            }
                          : undefined,
                    }}
                    render={({ field }) => (
                      <Input
                        id='value'
                        flex={1}
                        value={field.value?.toString()}
                        onChangeText={(text) =>
                          field.onChange(parseFloat(text) || 0)
                        }
                        placeholder={
                          commissionType === 'percentage'
                            ? 'Enter percentage'
                            : 'Enter amount'
                        }
                        borderColor={errors.value ? '$red8' : undefined}
                      />
                    )}
                  />
                  <View marginLeft='$2' padding='$2'>
                    {commissionType === 'percentage' ? (
                      <FiPercent size={20} />
                    ) : (
                      '₹'
                    )}
                  </View>
                </XStack>
                {errors.value && (
                  <Text color='$red10' fontSize='$2'>
                    {errors.value.message}
                  </Text>
                )}
              </YStack>
            )}

            {commissionType === 'tiered' && (
              <YStack space='$4'>
                <Label>Tiered Commission Structure</Label>

                {tiers.map((tier: any, index: any) => (
                  <Card key={index} bordered padding='$4' marginBottom='$2'>
                    <YStack space='$3'>
                      <XStack
                        justifyContent='space-between'
                        alignItems='center'
                      >
                        <Text fontWeight='bold'>Tier {index + 1}</Text>
                        {index > 0 && (
                          <Button
                            size='$3'
                            onPress={() => removeTier(index)}
                            icon={<FiTrash2 size={16} />}
                          >
                            Remove
                          </Button>
                        )}
                      </XStack>

                      <XStack space='$3' flexWrap='wrap'>
                        <YStack space='$1' flex={1} minWidth={140}>
                          <Label htmlFor={`tiers.${index}.minAmount`}>
                            Min Amount
                          </Label>
                          <Controller
                            name={`tiers.${index}.minAmount`}
                            control={control}
                            rules={{ required: 'Required' }}
                            render={({ field }) => (
                              <Input
                                id={`tiers.${index}.minAmount`}
                                value={field.value?.toString()}
                                onChangeText={(text) =>
                                  field.onChange(parseFloat(text) || 0)
                                }
                                placeholder='Min'
                              />
                            )}
                          />
                        </YStack>

                        <YStack space='$1' flex={1} minWidth={140}>
                          <Label htmlFor={`tiers.${index}.maxAmount`}>
                            Max Amount (optional)
                          </Label>
                          <Controller
                            name={`tiers.${index}.maxAmount`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                id={`tiers.${index}.maxAmount`}
                                value={field.value?.toString() || ''}
                                onChangeText={(text) =>
                                  field.onChange(
                                    text ? parseFloat(text) : undefined
                                  )
                                }
                                placeholder='Max'
                              />
                            )}
                          />
                        </YStack>
                      </XStack>

                      <XStack space='$3' flexWrap='wrap'>
                        <YStack space='$1' flex={1} minWidth={140}>
                          <Label htmlFor={`tiers.${index}.commissionType`}>
                            Commission Type
                          </Label>
                          <Controller
                            name={`tiers.${index}.commissionType`}
                            control={control}
                            render={({ field }) => (
                              <AsyncSelect
                                {...field}
                                id={`tiers.${index}.commissionType`}
                                value={field.value}
                                options={[
                                  {
                                    value: 'percentage',
                                    label: 'Percentage',
                                  },
                                  {
                                    value: 'fixed',
                                    label: ' Fixed Amount',
                                  },
                                ]}
                              />
                            )}
                          />
                        </YStack>

                        <YStack space='$1' flex={1} minWidth={140}>
                          <Label htmlFor={`tiers.${index}.commissionValue`}>
                            Commission Value
                          </Label>
                          <XStack alignItems='center'>
                            <Controller
                              name={`tiers.${index}.commissionValue`}
                              control={control}
                              rules={{ required: 'Required' }}
                              render={({ field }) => (
                                <Input
                                  id={`tiers.${index}.commissionValue`}
                                  flex={1}
                                  // type='number'
                                  value={field.value?.toString()}
                                  onChangeText={(text) =>
                                    field.onChange(parseFloat(text) || 0)
                                  }
                                  placeholder='Value'
                                />
                              )}
                            />
                            <View marginLeft='$2' padding='$2'>
                              {watch(`tiers.${index}.commissionType`) ===
                              'percentage' ? (
                                <FiPercent size={20} />
                              ) : (
                                '₹'
                              )}
                            </View>
                          </XStack>
                        </YStack>
                      </XStack>
                    </YStack>
                  </Card>
                ))}

                <Button
                  onPress={addTier}
                  size='$3'
                  icon={<FiPlus size={18} />}
                  variant='outlined'
                  marginTop='$2'
                >
                  Add Tier
                </Button>
              </YStack>
            )}

            <YStack space='$2'>
              <Label htmlFor='minOrderAmount'>Minimum Order Amount</Label>
              <XStack alignItems='center'>
                <Controller
                  name='minOrderAmount'
                  control={control}
                  rules={{
                    min: {
                      value: 0,
                      message: 'Must be a positive number',
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id='minOrderAmount'
                      flex={1}
                      value={field.value?.toString()}
                      onChangeText={(text) =>
                        field.onChange(parseFloat(text) || 0)
                      }
                      placeholder='0.00'
                      borderColor={errors.minOrderAmount ? '$red8' : undefined}
                    />
                  )}
                />
              </XStack>
              {errors.minOrderAmount && (
                <Text color='$red10' fontSize='$2'>
                  {errors.minOrderAmount.message}
                </Text>
              )}
            </YStack>

            <Card padding='$4' bordered>
              <YStack space='$3'>
                <Label>Conditions</Label>

                <XStack justifyContent='space-between' alignItems='center'>
                  <Text>Active</Text>
                  <Controller
                    name='conditions.isActive'
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        size='$2.5'
                        backgroundColor={field.value ? '$primary' : '$gray6'}
                      >
                        <Switch.Thumb />
                      </Switch>
                    )}
                  />
                </XStack>

                <XStack justifyContent='space-between' alignItems='center'>
                  <Text>Applies to On-Sale Items</Text>
                  <Controller
                    name='conditions.appliesToOnSaleItems'
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        size='$2.5'
                        backgroundColor={field.value ? '$primary' : '$gray6'}
                      >
                        <Switch.Thumb />
                      </Switch>
                    )}
                  />
                </XStack>

                <XStack justifyContent='space-between' alignItems='center'>
                  <Text>Applies to Clearance Items</Text>
                  <Controller
                    name='conditions.appliesToClearance'
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        size='$2.5'
                        backgroundColor={field.value ? '$primary' : '$gray6'}
                      >
                        <Switch.Thumb />
                      </Switch>
                    )}
                  />
                </XStack>
              </YStack>
            </Card>

            <XStack space='$3' justifyContent='flex-end' paddingTop='$4'>
              <Button
                size='$3'
                variant='outlined'
                onPress={() => reset()}
                icon={<FiRotateCcw size={16} />}
              >
                Reset
              </Button>
              <Button
                size='$3'
                backgroundColor='$primary'
                icon={isSubmitting ? <Spinner /> : <FiSave size={16} />}
                disabled={isSubmitting}
                onPress={handleSubmit(onSubmit)}
              >
                {isSubmitting ? 'Saving...' : 'Save Configuration'}
              </Button>
            </XStack>
          </YStack>
        </Form>
      </YStack>
    </YStack>
  );
};

export default CommissionConfigForm;
