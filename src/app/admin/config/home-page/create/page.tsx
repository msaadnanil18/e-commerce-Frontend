'use client';

import HomePageConfigForm, {
  HomePageConfigFormProps,
} from '@/components/admin/config/homePageConfig/HomePageConfigForm';
import AdminSidebar from '@/components/admin/organism/AdminSidebar';
import useFileUpload from '@/components/appComponets/fileupload/useFileUpload';
import { ServiceErrorManager } from '@/helpers/service';
import { CreateHomePageConfigService } from '@/services/homePageConfig';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView } from 'tamagui';

const HomePageConfigCreateForm: FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { getFileUpload } = useFileUpload();
  const form = useForm<HomePageConfigFormProps>({
    defaultValues: {
      name: '',
      isActive: true,
      featuredProducts: [],
      bannerProducts: [],
      categoryDisplay: {
        mainCategories: [],
        featuredCategories: [],
      },
    },
  });

  const onSubmit = async (value: HomePageConfigFormProps) => {
    setIsSubmitting(true);

    const { bannerProducts, categoryDisplay } = value;

    const uploadBannerProducts = await Promise.all(
      bannerProducts
        .filter(
          (banner) =>
            banner.displayOrder != null && !isNaN(Number(banner.displayOrder))
        )
        .map(async (banner) => ({
          ...banner,
          displayOrder: Number(banner.displayOrder),
          ...(banner.bannerThumbnail
            ? {
                bannerThumbnail: (
                  await getFileUpload([banner.bannerThumbnail as File])
                )[0],
              }
            : {}),
        }))
    );
    const uploadedCategoryDisplay = {
      ...categoryDisplay,
      mainCategories: await Promise.all(
        categoryDisplay.mainCategories.map(async (mainCategorie) => ({
          ...mainCategorie,
          ...(mainCategorie.customThumbnail
            ? {
                customThumbnail: (
                  await getFileUpload([mainCategorie.customThumbnail as File])
                )[0],
              }
            : {}),
        }))
      ),
    };

    await ServiceErrorManager(
      CreateHomePageConfigService({
        data: {
          payload: {
            ...value,
            bannerProducts: uploadBannerProducts,
            featuredCategories: uploadedCategoryDisplay,
          },
        },
      }),
      {}
    );
    setIsSubmitting(false);
    form.reset();
    router.back();
  };

  return (
    <div className='admin-container'>
      <AdminSidebar />
      <ScrollView scrollbarWidth='thin'>
        <HomePageConfigForm
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </ScrollView>
    </div>
  );
};

export default HomePageConfigCreateForm;
