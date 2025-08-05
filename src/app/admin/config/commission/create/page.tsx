'use client';

import CommissionConfigForm from '@/components/admin/config/commissionConfig/CommissionConfigForm';
import AdminSidebar from '@/components/admin/organism/AdminSidebar';
import { ServiceErrorManager } from '@/helpers/service';
import { CreateCommissionConfigService } from '@/services/Commission';
import { ICommissionConfigForm } from '@/types/Commission';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView } from 'tamagui';

const CommissionConfigCreate: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ICommissionConfigForm>({
    defaultValues: {
      category: '',
      commissionType: 'percentage',
      value: 0,
      minOrderAmount: 0,
      tiers: [
        { minAmount: 0, commissionValue: 0, commissionType: 'percentage' },
      ],
      conditions: {
        isActive: true,
        appliesToOnSaleItems: false,
        appliesToClearance: false,
      },
    },
  });

  const onSubmit = async (data: ICommissionConfigForm) => {
    setIsSubmitting(true);
    ServiceErrorManager(
      CreateCommissionConfigService({
        data: {
          payload: data,
        },
      }),
      {}
    ).finally(() => {
      setIsSubmitting(false);
      form.reset();
    });
  };

  return (
    <div className='admin-container'>
      <AdminSidebar />
      <ScrollView scrollbarWidth='thin'>
        <CommissionConfigForm {...{ form, isSubmitting, onSubmit }} />
      </ScrollView>
    </div>
  );
};

export default CommissionConfigCreate;
