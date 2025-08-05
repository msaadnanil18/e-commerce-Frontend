'use client';
import useFileUpload from '@/components/appComponets/fileupload/useFileUpload';
import {
  SellerRegistrationSteps,
  SellerFormData,
} from '@/components/auth/SellerRegistration';
import useAuth from '@/components/auth/useAuth';
import { ServiceErrorManager } from '@/helpers/service';
import { getPreviousMediaFiles, getRealFiles } from '@/helpers/utils';
import {
  GetSellerRefillDetails,
  SubmitSellerRefillService,
} from '@/services/seller';
import { useParams, useSearchParams } from 'next/navigation';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Spinner, YStack, Text } from 'tamagui';

const SellerRefillForm: FC = () => {
  const { logOut } = useAuth();
  const searchParams = useSearchParams();

  const params = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formValue, setFormValue] = useState<Partial<SellerFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const businessInformationForm = useForm<SellerFormData>();
  const addressInformationForm = useForm<SellerFormData>();
  const bankDetailsFrom = useForm<SellerFormData>();
  const documentsUploadFrom = useForm({});
  const { getFileUpload } = useFileUpload();

  const fetchSellers = async () => {
    setIsLoading(true);
    const [err, response] = await ServiceErrorManager(
      GetSellerRefillDetails({
        data: {
          query: {
            _id: params.sellerId,
          },
        },
      }),
      {
        failureMessage: 'Error while fetching customer details!',
      }
    );
    if (err || !response) return;
    businessInformationForm.reset(response);
    addressInformationForm.reset(response.address);
    bankDetailsFrom.reset(response.bankDetails);
    documentsUploadFrom.reset({ documents: response.documents });

    setIsLoading(false);
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const onSubmit = async (selectedDocuments: File[]) => {
    setIsSubmitting(true);
    const { documents, ...restformValue } = formValue;

    const newFiles = getRealFiles(selectedDocuments);
    let newUploadedFile: any[] = [];

    if (newFiles.length > 0) {
      newUploadedFile = await getFileUpload(newFiles);
    }

    const [err] = await ServiceErrorManager(
      SubmitSellerRefillService({
        data: {
          payload: {
            token: searchParams.get('token'),
            documents: [
              ...newUploadedFile,
              ...getPreviousMediaFiles(selectedDocuments),
            ],
            ...restformValue,
          },
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
    await logOut();
  };

  if (isLoading) {
    return (
      <YStack
        height='100vh'
        justifyContent='center'
        alignItems='center'
        space='$2'
      >
        <Spinner size='large' />
        <Text>Loading seller details...</Text>
      </YStack>
    );
  }

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

export default SellerRefillForm;
