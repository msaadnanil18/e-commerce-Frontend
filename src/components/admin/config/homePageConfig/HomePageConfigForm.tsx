'use client';

import React, { FC, useEffect, useState } from 'react';
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
import { startCase, truncate } from 'lodash-es';
import { IProduct } from '@/types/products';
import RecentProduct from './RecentProduct';

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
  _id: string;
  name: string;
  isActive: boolean;
  featuredProducts: string[] | Array<object>;
  recentAddedProduct: string[] | Array<object>;
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
  const [productSearch, setProductSearch] = useState<string>();
  const [productData, setProductData] = useState<
    Array<{ value: string; label: React.ReactNode }>
  >([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const fetchProductList = async () => {
    const [err, data] = await ServiceErrorManager(
      ProductListService({
        data: {
          options: {
            limit: 20,
          },
          query: {
            searchFields: ['name', 'productID'],
            search: productSearch,
            isApproved: true,
          },
        },
      }),
      {
        failureMessage: 'Error while fetching products',
      }
    );
    if (err || !data) return;
    setProductData(data.docs);
  };

  useEffect(() => {
    fetchProductList();
  }, [productSearch]);

  const searchProductList = async (search: string) => {
    setProductSearch(search);
    return productData;
  };

  return (
    <YStack padding='$4' space='$2'>
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
            fetchProductList={searchProductList}
          />
          <BannerProductsCreate
            fetchProductList={searchProductList}
            form={form}
          />
          <RecentProduct fetchProductList={searchProductList} form={form} />
          <MainCategoriesCreate form={form} />
          {/* <FeaturedCategory form={form} /> */}
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
