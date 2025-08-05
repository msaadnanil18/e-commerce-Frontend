'use client';

import CommissionConfigForm from '@/components/admin/config/commissionConfig/CommissionConfigForm';
import AdminSidebar from '@/components/admin/organism/AdminSidebar';
import { ServiceErrorManager } from '@/helpers/service';
import {
  GetCommissionConfig,
  UpdatedCommissionConfigService,
} from '@/services/Commission';
import { ICommissionConfigForm } from '@/types/Commission';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState, use } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, Spinner, View, Text } from 'tamagui';

interface CommissionConfigUpdatePageProps {
  params: Promise<{ commissionConfigId: string }>;
}

const UpdateCommisionConfig: FC<CommissionConfigUpdatePageProps> = ({
  params,
}) => {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [isSubmitting, setIsisSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCommissionConfig = () => {
    setLoading(true);
    ServiceErrorManager(
      GetCommissionConfig(unwrappedParams.commissionConfigId)(),
      {}
    )
      .then(([_, data]) => {
        form.reset(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCommissionConfig();
  }, []);

  const onSubmit = (data: ICommissionConfigForm) => {
    setIsisSubmitting(true);
    const { conditions, ...restData } = data;

    const filteredConditions = Object.fromEntries(
      Object.entries(conditions ?? {}).filter(
        ([_, value]) => value !== undefined
      )
    );

    const payload = {
      ...restData,
      conditions: filteredConditions,
    };

    ServiceErrorManager(
      UpdatedCommissionConfigService(unwrappedParams.commissionConfigId)({
        data: payload,
      }),
      {}
    ).finally(() => {
      setIsisSubmitting(false);
      router.back();
    });
  };
  const form = useForm<ICommissionConfigForm>();

  return (
    <div className='admin-container'>
      <AdminSidebar />
      {loading ? (
        <View flex={1} justifyContent='center' alignItems='center'>
          <Spinner size='large' />
          <Text>Loading Commission Configuration Details...</Text>
        </View>
      ) : (
        <ScrollView scrollbarWidth='thin'>
          <CommissionConfigForm
            {...{ form, isSubmitting, onSubmit }}
            isEdit={true}
          />
        </ScrollView>
      )}
    </div>
  );
};

export default UpdateCommisionConfig;
