'use client';

import ServiceChargeForm from '@/components/admin/config/serviceCharge/ServiceChargeForm';
import AdminSidebar from '@/components/admin/organism/AdminSidebar';
import { ServiceErrorManager } from '@/helpers/service';
import { CreateServiceChargeService } from '@/services/serviceCharges';
import { ServiceChargeFormData } from '@/types/ServiceCharge';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView } from 'tamagui';

const ServiceChargeCreate: FC = () => {
  const [isSubmiting, setIsisSubmiting] = useState<boolean>(false);
  const form = useForm<ServiceChargeFormData>();

  const onSubmit = (data: ServiceChargeFormData) => {
    const formattedData = {
      ...data,
      applicableStates: data.applicableStates
        ? data.applicableStates.split(',').map((s) => s.trim())
        : [],
    };
    setIsisSubmiting(true);
    ServiceErrorManager(
      CreateServiceChargeService({
        data: formattedData,
      }),
      { successMessage: 'Service charge created Successfully' }
    ).finally(() => {
      form.reset();
      setIsisSubmiting(false);
    });
  };
  return (
    <div className='admin-container'>
      <AdminSidebar />
      <ScrollView>
        <ServiceChargeForm {...{ form, onSubmit, isSubmiting }} />
      </ScrollView>
    </div>
  );
};

export default ServiceChargeCreate;
