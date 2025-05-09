'use client';

import useFileUpload from '@/components/appComponets/fileupload/useFileUpload';
import SellerRegistrationSteps, {
  SellerFormData,
} from '@/components/auth/SellerRegistration';
import useAuth from '@/components/auth/useAuth';
import { ServiceErrorManager } from '@/helpers/service';
import { SellerRegistrationService } from '@/services/seller';
import { RootState } from '@/states/store/store';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const SellerRegistration: FC = () => {
  const { logOut } = useAuth();
  const user = useSelector((state: RootState) => state.user);
  const [currentStep, setCurrentStep] = useState(0);
  const [formValue, setFormValue] = useState<Partial<SellerFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const businessInformationForm = useForm<SellerFormData>();
  const addressInformationForm = useForm<SellerFormData>();
  const bankDetailsFrom = useForm<SellerFormData>();
  const documentsUploadFrom = useForm({});
  const { getFileUpload } = useFileUpload();

  const onSubmit = async (selectedDocuments: File[]) => {
    try {
      setIsSubmitting(true);
      const uploadFile = await getFileUpload(selectedDocuments);

      const [err] = await ServiceErrorManager(
        SellerRegistrationService({
          data: {
            payload: {
              documents: uploadFile,
              ...formValue,
            },
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(user?.user as any).sessionToken}`,
          },
        }),
        {
          failureMessage: 'Error while registration Please try sometime later',
          successMessage: 'Registration successful',
        }
      );
      if (err) return;
      setCurrentStep((prev) => prev + 1);
      setIsSubmitting(false);
      // if (typeof window !== 'undefined') {
      //   localStorage.removeItem('sessionToken');
      // }
      await logOut();
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <SellerRegistrationSteps
      {...{
        currentStep,
        setCurrentStep,
        onSubmit,
        isSubmitting,
        setFormValue,
        businessInformationForm,
        addressInformationForm,
        bankDetailsFrom,
        documentsUploadFrom,
      }}
    />
  );
};

export default SellerRegistration;
