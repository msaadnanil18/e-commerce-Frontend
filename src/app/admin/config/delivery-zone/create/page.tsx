'use client';

import React, { useState } from 'react';
import { ScrollView, YStack } from 'tamagui';
import { useForm } from 'react-hook-form';
import { CreateDeliveryZoneService } from '@/services/delivery';
import { ServiceErrorManager } from '@/helpers/service';
import { DeliveryZone } from '@/types/deliverZone';

import AdminSidebar from '@/components/admin/organism/AdminSidebar';
import DeliveryZoneForm from '@/components/admin/config/DeliveryCharges/DeliveryZoneForm';

const DeliveryCreate = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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

  const onSubmit = async (data: DeliveryZone) => {
    setIsSubmitting(true);
    ServiceErrorManager(
      CreateDeliveryZoneService({
        data: data,
      }),
      { successMessage: 'Delivery zone created successfully' }
    ).finally(() => {
      form.reset();
      setIsSubmitting(false);
    });
  };

  return (
    <div className='admin-container'>
      <AdminSidebar />
      <ScrollView>
        <DeliveryZoneForm {...{ form, onSubmit }} isLoading={isSubmitting} />
      </ScrollView>
    </div>
  );
};

export default DeliveryCreate;
