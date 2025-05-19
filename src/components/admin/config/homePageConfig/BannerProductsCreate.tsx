import FileUpload from '@/components/appComponets/fileupload/FileUpload';
import AsyncSelect from '@/components/appComponets/select/AsyncSelect';
import { FC, memo } from 'react';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';
import { FiArrowDown, FiArrowUp, FiPlus, FiTrash2 } from 'react-icons/fi';
import {
  Button,
  Input,
  Label,
  SizableText,
  Text,
  XStack,
  YStack,
} from 'tamagui';
import { HomePageConfigFormProps } from './HomePageConfigForm';

const BannerProductsCreate: FC<{
  form: UseFormReturn<HomePageConfigFormProps>;
  fetchProductList: (r: string) => Promise<any[]>;
}> = ({ form, fetchProductList }) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = form;
  const bannerProductsArray = useFieldArray({
    control,
    name: 'featuredProducts',
  });

  const moveItem = (
    fieldArray: any,
    index: number,
    direction: 'up' | 'down'
  ) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === fieldArray.fields.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    fieldArray.swap(index, newIndex);

    fieldArray.fields.forEach((item: any, idx: number) => {
      setValue(`${fieldArray.name}.${idx}.position` as any, idx + 1);
    });
  };

  return (
    <YStack space='$4'>
      <Label>Banner Products</Label>
      <YStack space='$4'>
        {bannerProductsArray.fields.map((field, index) => (
          <YStack space='$3' key={field.id}>
            <XStack
              space='$2'
              justifyContent='space-between'
              alignItems='center'
            >
              <SizableText>Banner #{index + 1}</SizableText>
              <XStack space='$2'>
                <Button
                  icon={<FiArrowUp />}
                  onPress={() => moveItem(bannerProductsArray, index, 'up')}
                  disabled={index === 0}
                  size='$2'
                />
                <Button
                  icon={<FiArrowDown />}
                  onPress={() => moveItem(bannerProductsArray, index, 'down')}
                  disabled={index === bannerProductsArray.fields.length - 1}
                  size='$2'
                />
                <Button
                  icon={<FiTrash2 />}
                  onPress={() => bannerProductsArray.remove(index)}
                  size='$2'
                />
              </XStack>
            </XStack>

            <Controller
              control={control}
              name={`bannerProducts.${index}.displayOrder`}
              render={({ field }) => (
                <Input {...field} value={(field.value || '').toString()} />
              )}
            />

            <YStack space='$2'>
              <Label htmlFor={`bannerProducts.${index}.product`}>Product</Label>
              <Controller
                control={control}
                name={`bannerProducts.${index}.product`}
                rules={{ required: 'Product is required' }}
                render={({ field }) => (
                  // @ts-ignore
                  <AsyncSelect
                    id={`bannerProducts.${index}.product`}
                    searchable={true}
                    loadOptions={fetchProductList}
                    isAsync={true}
                    {...field}
                  />
                )}
              />
              {errors.bannerProducts?.[index]?.product && (
                <Text color='$red10'>
                  {errors.bannerProducts[index]?.product?.message}
                </Text>
              )}
            </YStack>

            <YStack space='$2'>
              <Label htmlFor={`bannerProducts.${index}.bannerImageUrl`}>
                Banner Image
              </Label>
              <FileUpload
                form={form}
                className='w-full max-w-md mx-auto '
                multiple={false}
                accept={['.jpg', '.jpeg', '.png']}
                name={`bannerProducts.${index}.bannerThumbnail`}
              />
            </YStack>
          </YStack>
        ))}
        <Button
          icon={<FiPlus />}
          onPress={() =>
            bannerProductsArray.append({
              product: '',
              bannerThumbnail: '',
              displayOrder: bannerProductsArray.fields.length + 1,
            })
          }
        >
          Add Banner Product
        </Button>
      </YStack>
    </YStack>
  );
};

export default memo(BannerProductsCreate);
