import React, { FC } from 'react';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';
import { HomePageConfigFormProps } from './HomePageConfigForm';
import { Label, XStack, YStack, Text, Button } from 'tamagui';
import AsyncSelect from '@/components/appComponets/select/AsyncSelect';
import RenderDriveFile from '@/components/appComponets/fileupload/RenderDriveFile';
import { startCase, truncate } from 'lodash-es';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const RecentProduct: FC<{
  form: UseFormReturn<HomePageConfigFormProps>;
  fetchProductList: (r: string) => Promise<any[]>;
}> = ({ form, fetchProductList }) => {
  const {
    control,
    watch,
    formState: { errors },
  } = form;
  const recentAddedProductArray = useFieldArray({
    control,
    name: 'recentAddedProduct',
  });

  const getProductDetails = (productValue: any) => {
    if (typeof productValue === 'string') {
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
  const watchedRecentProducts = watch('recentAddedProduct');
  return (
    <YStack>
      <Label>Recent Added Product</Label>
      <YStack flex={1}>
        {recentAddedProductArray.fields.map((field, index) => {
          const currentProduct = watchedRecentProducts?.[index];
          const productDetails = getProductDetails(currentProduct);
          const productId = getProductId(currentProduct);

          return (
            <XStack key={field.id || index} space='$2' alignItems='center'>
              <XStack flex={1}>
                <Controller
                  control={control}
                  name={`recentAddedProduct.${index}`}
                  render={({ field }) => (
                    <AsyncSelect
                      id={`recentAddedProduct.${index}`}
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
                                  width: '44px',
                                  height: '44px',
                                  objectFit: 'cover',
                                  borderRadius: '4px',
                                }}
                                file={product.thumbnail}
                              />
                              <div>
                                {startCase(
                                  truncate(product.name, { length: 20 })
                                )}

                                <div className='text-blue-800 text-xs'>
                                  {product?.productID}
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
                                width: '44px',
                                height: '44px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                              }}
                              file={productDetails.thumbnail}
                            />
                            <div>
                              {startCase(
                                truncate(productDetails.name, { length: 20 })
                              )}

                              <div className='text-blue-800 text-xs'>
                                {productDetails?.productID}
                              </div>
                            </div>
                          </div>
                        ) : undefined
                      }
                      value={productId}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                    />
                  )}
                />
              </XStack>
              <Button
                icon={<FiTrash2 />}
                onPress={() => recentAddedProductArray.remove(index)}
                size='$2'
                backgroundColor='$red2'
                borderColor='$red7'
                color='$red11'
              />
            </XStack>
          );
        })}

        <Button
          size='$3'
          variant='outlined'
          icon={<FiPlus />}
          onPress={() => recentAddedProductArray.append('')}
          alignSelf='flex-start'
        >
          Add Recent Product
        </Button>
      </YStack>
    </YStack>
  );
};

export default RecentProduct;
