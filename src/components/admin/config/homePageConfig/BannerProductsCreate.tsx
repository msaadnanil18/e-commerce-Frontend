import FileUpload from '@/components/appComponets/fileupload/FileUpload';
import AsyncSelect from '@/components/appComponets/select/AsyncSelect';
import { FC } from 'react';
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
import RenderDriveFile from '@/components/appComponets/fileupload/RenderDriveFile';
import { startCase, truncate } from 'lodash-es';

const BannerProductsCreate: FC<{
  form: UseFormReturn<HomePageConfigFormProps>;
  fetchProductList: (r: string) => Promise<any[]>;
}> = ({ form, fetchProductList }) => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const bannerProductsArray = useFieldArray({
    control,
    name: 'bannerProducts',
  });

  const watchedBannerProducts = watch('bannerProducts');

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
      setValue(`bannerProducts.${idx}.displayOrder` as any, idx + 1);
    });
  };

  const getProductDetails = (productValue: any) => {
    if (typeof productValue === 'string' || !productValue) {
      return null;
    }
    return productValue;
  };

  const getProductId = (productValue: any) => {
    if (typeof productValue === 'string') {
      return productValue;
    }
    return productValue?._id || '';
  };

  return (
    <YStack space='$4'>
      <Label>Banner Products</Label>
      <YStack space='$4'>
        {bannerProductsArray.fields.map((field, index) => {
          const currentBanner = watchedBannerProducts?.[index];
          const productDetails = getProductDetails(currentBanner?.product);
          const productId = getProductId(currentBanner?.product);

          return (
            <YStack
              space='$3'
              marginTop='$3'
              key={field.id}
              padding='$4'
              backgroundColor='$cardBackground'
              borderRadius='$4'
              borderWidth={1}
              borderColor='$cardBackground'
            >
              <XStack
                space='$2'
                justifyContent='space-between'
                alignItems='center'
              >
                <SizableText fontSize='$4' fontWeight='500'>
                  Banner #{index + 1}
                </SizableText>
                <XStack space='$2'>
                  <Button
                    icon={<FiArrowUp />}
                    onPress={() => moveItem(bannerProductsArray, index, 'up')}
                    disabled={index === 0}
                    size='$2'
                    variant='outlined'
                  />
                  <Button
                    icon={<FiArrowDown />}
                    onPress={() => moveItem(bannerProductsArray, index, 'down')}
                    disabled={index === bannerProductsArray.fields.length - 1}
                    size='$2'
                    variant='outlined'
                  />
                  <Button
                    icon={<FiTrash2 />}
                    onPress={() => bannerProductsArray.remove(index)}
                    size='$2'
                    backgroundColor='$red2'
                    borderColor='$red7'
                    color='$red11'
                  />
                </XStack>
              </XStack>

              <YStack space='$2'>
                <Label htmlFor={`bannerProducts.${index}.displayOrder`}>
                  Display Order
                </Label>
                <Controller
                  control={control}
                  name={`bannerProducts.${index}.displayOrder`}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={(field.value || '').toString()}
                      onChangeText={(text) => field.onChange(Number(text) || 0)}
                      keyboardType='numeric'
                      placeholder='Enter display order'
                    />
                  )}
                />
              </YStack>

              <YStack space='$2'>
                <Label htmlFor={`bannerProducts.${index}.product`}>
                  Product *
                </Label>
                <Controller
                  control={control}
                  name={`bannerProducts.${index}.product`}
                  rules={{ required: 'Product is required' }}
                  render={({ field: controllerField }) => (
                    <AsyncSelect
                      id={`bannerProducts.${index}.product`}
                      placeholder='Select a product for banner'
                      searchable={true}
                      //@ts-ignore
                      loadOptions={async (searchQuery) => {
                        const results = await fetchProductList(searchQuery);
                        return results.map((product) => ({
                          key: product._id,
                          label: (
                            <div className='flex items-center text-sm space-x-2'>
                              <RenderDriveFile
                                style={{
                                  width: '48px',
                                  height: '48px',
                                  objectFit: 'cover',
                                  borderRadius: '4px',
                                }}
                                file={product.thumbnail}
                              />
                              <div className='flex flex-col'>
                                <div className='font-medium'>
                                  {startCase(
                                    truncate(product.name, { length: 25 })
                                  )}
                                </div>
                                <div className='text-blue-600 text-xs'>
                                  ID: {product?.productID}
                                </div>
                              </div>
                            </div>
                          ),
                          value: product._id,
                        }));
                      }}
                      isAsync={true}
                      defaultLabel={
                        productDetails ? (
                          <div className='flex items-center text-sm space-x-2'>
                            <RenderDriveFile
                              style={{
                                width: '48px',
                                height: '48px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                              }}
                              file={productDetails.thumbnail}
                            />
                            <div className='flex flex-col'>
                              <div className='font-medium'>
                                {startCase(
                                  truncate(productDetails.name, { length: 25 })
                                )}
                              </div>
                              <div className='text-blue-600 text-xs'>
                                ID: {productDetails?.productID}
                              </div>
                            </div>
                          </div>
                        ) : undefined
                      }
                      value={productId}
                      onChange={(value) => {
                        console.log(
                          `Banner ${index} - Selected product ID:`,
                          value
                        );
                        controllerField.onChange(value);
                      }}
                    />
                  )}
                />
                {errors.bannerProducts?.[index]?.product && (
                  <Text color='$red10' fontSize='$2'>
                    {errors.bannerProducts[index]?.product?.message}
                  </Text>
                )}
              </YStack>

              <YStack space='$2'>
                <Label htmlFor={`bannerProducts.${index}.bannerThumbnail`}>
                  Banner Image
                </Label>
                <Text color='$gray11' fontSize='$3'>
                  Upload a custom banner image for this product (optional)
                </Text>
                <FileUpload
                  form={form}
                  maxFiles={1}
                  className='w-full max-w-md'
                  multiple={false}
                  accept={['.jpg', '.jpeg', '.png', '.webp']}
                  name={`bannerProducts.${index}.bannerThumbnail`}
                />
                {errors.bannerProducts?.[index]?.bannerThumbnail && (
                  <Text color='$red10' fontSize='$2'>
                    {errors.bannerProducts[index]?.bannerThumbnail?.message}
                  </Text>
                )}
              </YStack>
            </YStack>
          );
        })}

        {/* Add New Banner Button */}
        <Button
          size='$3'
          variant='outlined'
          icon={<FiPlus />}
          onPress={() =>
            bannerProductsArray.append({
              product: '',
              bannerThumbnail: '',
              displayOrder: bannerProductsArray.fields.length + 1,
            })
          }
          alignSelf='flex-start'
        >
          Add Banner Product
        </Button>

        {/* Global validation error */}
        {errors.bannerProducts && typeof errors.bannerProducts === 'object' && (
          <Text color='$red10' fontSize='$2'>
            Please fix the errors in banner products above
          </Text>
        )}
      </YStack>
    </YStack>
  );
};

export default BannerProductsCreate;
