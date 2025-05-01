'use client';

import ServiceChargeForm from '@/components/admin/config/serviceCharge/ServiceChargeForm';
import AdminSidebar from '@/components/admin/organism/AdminSidebar';
import { ServiceErrorManager } from '@/helpers/service';
import {
  GetServiceCharge,
  UpdateServiceChargeService,
} from '@/services/serviceCharges';
import { ServiceChargeFormData } from '@/types/ServiceCharge';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, Spinner, View, Text } from 'tamagui';

interface ServiceChargeUpdatePageProps {
  params: { serviceChargeId: string };
}

const ServiceChargeUpdate: FC<ServiceChargeUpdatePageProps> = ({ params }) => {
  const router = useRouter();
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<ServiceChargeFormData>();

  const fetchServiceCharge = () => {
    setLoading(true);
    ServiceErrorManager(GetServiceCharge(params.serviceChargeId)(), {})
      .then(([_, response]) => {
        form.reset(response);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServiceCharge();
  }, []);

  const onSubmit = (data: ServiceChargeFormData) => {
    setIsSubmiting(true);

    const formattedData = {
      ...data,
      applicableStates:
        typeof data.applicableStates === 'string'
          ? data.applicableStates.split(',').map((s) => s.trim())
          : Array.isArray(data.applicableStates)
          ? data.applicableStates
          : [],
    };

    ServiceErrorManager(
      UpdateServiceChargeService(params.serviceChargeId)({
        data: formattedData,
      }),
      {
        successMessage: 'Service charge updated successfully',
      }
    ).finally(() => {
      setIsSubmiting(false);
      router.back();
    });
  };

  return (
    <div className='admin-container'>
      <AdminSidebar />
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Spinner size='large' />
          <Text>Loading service charges Details...</Text>
        </View>
      ) : (
        <ScrollView>
          <ServiceChargeForm {...{ form, onSubmit, isSubmiting }} isEdit />
        </ScrollView>
      )}
    </div>
  );
};

export default ServiceChargeUpdate;
