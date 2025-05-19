import AsyncSelect from '@/components/appComponets/select/AsyncSelect';
import { FC, memo } from 'react';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Button, Text, XStack, YStack } from 'tamagui';
import { HomePageConfigFormProps } from './HomePageConfigForm';

const FeaturedProductsCreate: FC<{
  form: UseFormReturn<HomePageConfigFormProps>;
  fetchProductList: (r: string) => Promise<any[]>;
}> = ({ form, fetchProductList }) => {
  const {
    control,
    formState: { errors },
  } = form;
  const featuredProductsArray = useFieldArray({
    control,
    name: 'featuredProducts',
  });

  return (
    <YStack space='$4'>
      <YStack space='$3'>
        {featuredProductsArray.fields.map((field, index) => (
          <XStack key={field.id} space='$2' alignItems='center'>
            <Controller
              control={control}
              name={`featuredProducts.${index}`}
              rules={{ required: 'Product is required' }}
              render={({ field }) => (
                //@ts-ignore
                <AsyncSelect
                  id={`featuredProducts.${index}`}
                  searchable={true}
                  loadOptions={(searchQuery) => fetchProductList(searchQuery)}
                  isAsync={true}
                  {...field}
                />
              )}
            />
            <Button
              icon={<FiTrash2 />}
              onPress={() => featuredProductsArray.remove(index)}
            />
          </XStack>
        ))}
        {errors.featuredProducts && (
          <Text color='$red10'>Featured products are required</Text>
        )}
        <Button
          icon={<FiPlus />}
          onPress={() => featuredProductsArray.append('')}
        >
          Add Featured Product
        </Button>
      </YStack>
    </YStack>
  );
};

export default memo(FeaturedProductsCreate);
