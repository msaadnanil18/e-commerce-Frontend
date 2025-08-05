'use client';

import React, { useEffect, FC, useState } from 'react';
import { Spinner, View, Text, ScrollView } from 'tamagui';
import { useForm } from 'react-hook-form';
import {
  GetDeliveryZoneService,
  UpdateDeliveryZoneService,
} from '@/services/delivery';
import { ServiceErrorManager } from '@/helpers/service';
import { DeliveryZone } from '@/types/deliverZone';

import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/organism/AdminSidebar';
import DeliveryZoneForm from '@/components/admin/config/DeliveryCharges/DeliveryZoneForm';

interface ProductManagePagePropsPageProps {
  params: { deliveryZoneId: string };
}

const DeliveryUpdate: FC<ProductManagePagePropsPageProps> = ({ params }) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<DeliveryZone>({
    defaultValues: {
      name: '',
      regions: [],
      baseCharge: 0,
      weightRate: 0,
      volumetricRate: 0,
      estimatedDays: 1,
    },
  });

  const fetchDeliveryZone = async () => {
    setLoading(true);
    ServiceErrorManager(GetDeliveryZoneService(params.deliveryZoneId)({}), {})
      .then(([_, response]) => form.reset(response))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDeliveryZone();
  }, []);
  const onSubmit = async (data: DeliveryZone) => {
    setIsSaving(true);
    ServiceErrorManager(
      UpdateDeliveryZoneService(params.deliveryZoneId)({
        data: data,
      }),
      { successMessage: 'Delivery zone created successfully' }
    ).finally(() => {
      setIsSaving(false);
      router.back();
    });
  };

  return (
    <div className='admin-container'>
      <AdminSidebar />

      {loading ? (
        <View flex={1} justifyContent='center' alignItems='center' padding='$4'>
          <Spinner size='large' color='$blue10' />
          <Text marginTop='$4'>Loading Delivery details...</Text>
        </View>
      ) : (
        <ScrollView scrollbarWidth='thin'>
          <DeliveryZoneForm
            form={form}
            onSubmit={onSubmit}
            isLoading={isSaving}
            isEditing
          />
        </ScrollView>
      )}
    </div>
  );
};

export default DeliveryUpdate;
