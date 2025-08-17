'use client';

import HomePageConfigForm, {
  HomePageConfigFormProps,
} from '@/components/admin/config/homePageConfig/HomePageConfigForm';
import AdminSidebar from '@/components/admin/organism/AdminSidebar';
import useFileUpload from '@/components/appComponets/fileupload/useFileUpload';
import { ServiceErrorManager } from '@/helpers/service';
import { getRealFiles } from '@/helpers/utils';
import {
  GetHomePageConfigService,
  UpdateHomePageConfigService,
} from '@/services/homePageConfig';
import { useRouter } from 'next/navigation';

import { FC, use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, Spinner, View, Text } from 'tamagui';

interface HomePageConfigUpdatePageProps {
  params: Promise<{ homePageConfigId: string }>;
}

const UpdateHomePageConfig: FC<HomePageConfigUpdatePageProps> = ({
  params,
}) => {
  const { getFileUpload } = useFileUpload();
  const router = useRouter();
  const form = useForm<HomePageConfigFormProps>();
  const unwrappedParams = use(params);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchHomeConfig = async () => {
    const populate = [
      {
        path: 'featuredProducts',
        populate: 'category',
      },
      {
        path: 'recentAddedProduct',
      },
      {
        path: 'bannerProducts.product',
        populate: 'category',
      },
      {
        path: 'categoryDisplay.mainCategories.category',
      },
      {
        path: 'categoryDisplay.featuredCategories.category',
      },
    ];

    setLoading(true);

    const [err, data] = await ServiceErrorManager(
      GetHomePageConfigService(unwrappedParams.homePageConfigId)({
        params: { populate: JSON.stringify(populate) },
      }),
      {
        failureMessage: 'Failed to load home page configuration',
      }
    );

    if (err || !data) return;

    const normalizedData = {
      ...data,

      featuredProducts:
        data.featuredProducts?.map((product: any) =>
          typeof product === 'string' ? product : product
        ) || [],

      bannerProducts:
        data.bannerProducts?.map((banner: any) => ({
          product:
            typeof banner.product === 'string'
              ? banner.product
              : banner.product?._id,
          bannerThumbnail: banner.bannerThumbnail,
          displayOrder: banner.displayOrder || 0,
        })) || [],

      categoryDisplay: {
        mainCategories:
          data.categoryDisplay?.mainCategories?.map((cat: any) => ({
            category:
              typeof cat.category === 'string'
                ? cat.category
                : cat.category?._id,
            position: cat.position || 0,
            customName: cat.customName,
            customThumbnail: cat.customThumbnail,
          })) || [],
        featuredCategories:
          data.categoryDisplay?.featuredCategories?.map((cat: any) => ({
            category:
              typeof cat.category === 'string'
                ? cat.category
                : cat.category?._id,
            position: cat.position || 0,
            highlightText: cat.highlightText,
            badgeText: cat.badgeText,
          })) || [],
      },
    };

    form.reset(normalizedData);

    setLoading(false);
  };

  useEffect(() => {
    fetchHomeConfig().catch(console.error);
  }, [unwrappedParams.homePageConfigId]);

  const onSubmit = async (formData: HomePageConfigFormProps) => {
    setIsSubmitting(true);
    const { _id, bannerProducts, ...restFormData } = formData;

    const updatedbannerProducts = await Promise.all(
      bannerProducts.map(async (banner) => {
        const realFile = getRealFiles([banner.bannerThumbnail]);
        const uploadedFiles =
          realFile.length > 0
            ? await getFileUpload(realFile)
            : [banner.bannerThumbnail];
        return {
          ...banner,
          bannerThumbnail: uploadedFiles[0],
        };
      })
    );
    await ServiceErrorManager(
      UpdateHomePageConfigService(_id)({
        data: {
          payload: {
            ...restFormData,
            bannerProducts: updatedbannerProducts,
          },
        },
      }),
      {}
    );

    setIsSubmitting(false);
    router.back();
  };

  return (
    <div className='admin-container'>
      <AdminSidebar />

      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <Spinner size='large' />
          <Text marginTop='$3' color='$gray11'>
            Loading Home page config details...
          </Text>
        </View>
      ) : (
        <ScrollView>
          <HomePageConfigForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            isEdit
          />
        </ScrollView>
      )}
    </div>
  );
};

export default UpdateHomePageConfig;
