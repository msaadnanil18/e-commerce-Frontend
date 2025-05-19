'use client';

import HomePageConfigForm, {
  HomePageConfigFormProps,
} from '@/components/admin/config/homePageConfig/HomePageConfigForm';
import AdminSidebar from '@/components/admin/organism/AdminSidebar';
import { ServiceErrorManager } from '@/helpers/service';
import { GetHomePageConfigService } from '@/services/homePageConfig';

import { FC, use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, Spinner, View, Text } from 'tamagui';

interface HomePageConfigUpdatePageProps {
  params: Promise<{ homePageConfigId: string }>;
}

const UpdateHomePageConfig: FC<HomePageConfigUpdatePageProps> = ({
  params,
}) => {
  const form = useForm<HomePageConfigFormProps>();
  const unwrappedParams = use(params);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchHomeConfig = async () => {
    setLoading(true);
    const [err, data] = await ServiceErrorManager(
      GetHomePageConfigService(unwrappedParams.homePageConfigId)(),
      {}
    );
    if (err || !data) return;
    form.reset(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHomeConfig().catch(console.log);
  }, []);

  const onSubmit = () => {};
  return (
    <div className='admin-container'>
      <AdminSidebar />

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Spinner size='large' />
          <Text>Loading Home page config Details...</Text>
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
