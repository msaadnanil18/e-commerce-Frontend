'use client';

import { FC, useCallback } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { FaSave } from 'react-icons/fa';
import {
  Button,
  H6,
  Input,
  Label,
  ScrollView,
  Separator,
  Spinner,
  Switch,
  Text,
  XStack,
  YStack,
} from 'tamagui';
import BannerProductsCreate from './BannerProductsCreate';
import FeaturedCategory from './FeaturedCategoryCreate';
import FeaturedProductsCreate from './FeaturedProductsCreate';
import MainCategoriesCreate from './MainCategoriesCreate';
import { ServiceErrorManager } from '@/helpers/service';
import { ProductListService } from '@/services/products';
import RenderDriveFile from '@/components/appComponets/fileupload/RenderDriveFile';
import { debounce, startCase, truncate } from 'lodash-es';
import { IProduct } from '@/types/products';

interface BannerProduct {
  product: string;
  bannerThumbnail?: string | File;
  displayOrder: number;
}

interface MainCategory {
  category: string;
  position: number;
  customName?: string;
  customThumbnail?: string | File;
}

interface FeaturedCategory {
  category: string;
  position: number;
  highlightText?: string;
  badgeText?: string;
}
export interface HomePageConfigFormProps {
  name: string;
  isActive: boolean;
  featuredProducts: string[] | Array<object>;
  bannerProducts: BannerProduct[];
  categoryDisplay: {
    mainCategories: MainCategory[];
    featuredCategories: FeaturedCategory[];
  };
}

const HomePageConfigForm: FC<{
  onSubmit: (r: HomePageConfigFormProps) => void;
  form: UseFormReturn<HomePageConfigFormProps>;
  isSubmitting: boolean;
  isEdit?: boolean;
}> = ({ form, onSubmit, isEdit = false, isSubmitting }) => {
  const {
    control,
    handleSubmit,

    formState: { errors },
  } = form;

  const fetchProductList = useCallback((search: string) => {
    return new Promise<any[]>((resolve) => {
      debounce(async (search: string) => {
        const [err, data] = await ServiceErrorManager(
          ProductListService({
            data: {
              options: {
                limit: 50,
              },
              query: {
                searchFields: ['name', 'productID'],
                search,
                isApproved: true,
              },
            },
          }),
          {
            failureMessage: 'Error while fetching products',
          }
        );

        resolve(
          (data.docs || []).map((product: IProduct) => ({
            label: (
              <div className='flex items-center text-sm space-x-2'>
                <RenderDriveFile
                  style={{
                    width: '64px',
                    height: '64px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                  file={product.thumbnail}
                />
                <div>{startCase(truncate(product.name, { length: 20 }))}</div>
                <div className=' text-blue-800 text-xs'>
                  {product?.productID}
                </div>
              </div>
            ),
            value: product?._id,
          }))
        );
      }, 540)(search);
    });
  }, []);

  return (
    <YStack padding='$4' space='$4'>
      <XStack justifyContent='space-between' alignItems='center'>
        <H6>{isEdit ? 'Edit Home Page Config' : 'Create Home Page Config'}</H6>
      </XStack>
      <Separator />
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack space='$3' padding='$3'>
          <YStack space='$2'>
            <Label htmlFor='name'>Config Name</Label>
            <Controller
              control={control}
              name='name'
              rules={{ required: 'Config name is required' }}
              render={({ field }) => (
                <Input
                  id='name'
                  placeholder='Enter configuration name'
                  {...field}
                />
              )}
            />
            {errors.name && <Text color='$red10'>{errors.name.message}</Text>}
          </YStack>

          <XStack alignItems='center' space='$2'>
            <Label htmlFor='isActive'>Active Status</Label>
            <Controller
              control={control}
              name='isActive'
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
          <FeaturedProductsCreate
            form={form}
            fetchProductList={fetchProductList}
          />
          <BannerProductsCreate
            fetchProductList={fetchProductList}
            form={form}
          />
          <MainCategoriesCreate form={form} />
          <FeaturedCategory form={form} />
          <Button
            size='$3'
            backgroundColor='$primary'
            icon={isSubmitting ? <Spinner /> : <FaSave />}
            onPress={handleSubmit(onSubmit)}
            marginTop='$2'
          >
            {isEdit ? 'Update Configuration ' : 'Create Configuration'}
          </Button>
        </YStack>
      </ScrollView>
    </YStack>
  );
};

export default HomePageConfigForm;
