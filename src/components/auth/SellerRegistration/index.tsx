'use client';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { View, Button, Spinner } from 'tamagui';
import { FaUser, FaFlag, FaSave } from 'react-icons/fa';
import { PiBankFill } from 'react-icons/pi';
import { IoCheckmarkOutline, IoDocument } from 'react-icons/io5';
import StepNavigationBar from '@/components/appComponets/steps/StepNavigationBar';
import AddressInformation from '@/components/auth/SellerRegistration/AddressInformation';
import BankDetails from '@/components/auth/SellerRegistration/BankDetails';
import RegistrationCompletion from '@/components/auth/SellerRegistration/RegistrationCompletion';
import SellerDocument from '@/components/auth/SellerRegistration/SellerDocument';
import BusinessInformation from '@/components/auth/SellerRegistration/ BusinessInformation';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { UseFormReturn } from 'react-hook-form';

export interface SellerFormData {
  businessName: string;
  gstNumber: string;
  contactEmail: string;
  contactPhone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  accountHolderName: string;
  documents?: any[];
}

export const validateRequired = (value: string) => {
  return value ? true : 'This field is required';
};

const SellerRegistrationSteps: FC<{
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  isSubmitting: boolean;
  onSubmit: (r: File[]) => void;
  setFormValue: Dispatch<SetStateAction<Partial<SellerFormData>>>;
  businessInformationForm: UseFormReturn<SellerFormData>;
  addressInformationForm: UseFormReturn<SellerFormData>;
  bankDetailsFrom: UseFormReturn<SellerFormData>;
  documentsUploadFrom: UseFormReturn;
}> = (props) => {
  const {
    currentStep,
    setCurrentStep,
    isSubmitting,
    onSubmit,
    setFormValue,
    businessInformationForm,
    addressInformationForm,
    bankDetailsFrom,
    documentsUploadFrom,
  } = props;

  const steps = [
    {
      key: 'businessInformation',
      title: 'Business Information',
      icon: <FaUser />,
      content: <BusinessInformation form={businessInformationForm} />,
    },
    {
      key: 'addressInformation',
      title: 'Address Information',
      icon: <FaFlag />,
      content: <AddressInformation form={addressInformationForm} />,
    },
    {
      key: 'bankDetails',
      title: 'Bank Details',
      icon: <PiBankFill size={17} />,
      content: <BankDetails form={bankDetailsFrom} />,
    },
    {
      key: 'SellerDocument',
      title: 'Document',
      icon: <IoDocument size={17} />,
      content: <SellerDocument form={documentsUploadFrom} />,
    },

    {
      key: 'complate',
      title: 'Complate',
      icon: <IoCheckmarkOutline />,
      content: <RegistrationCompletion />,
    },
  ];

  const handleNext = async () => {
    let isValid = false;

    switch (currentStep) {
      case 0:
        await businessInformationForm.handleSubmit((data) => {
          setFormValue((prev) => ({ ...prev, ...data }));
          isValid = true;
        })();
        break;
      case 1:
        await addressInformationForm.handleSubmit((data) => {
          setFormValue((prev) => ({ ...prev, address: data }));
          isValid = true;
        })();
        break;
      case 2:
        await bankDetailsFrom.handleSubmit((data) => {
          setFormValue((prev) => ({ ...prev, bankDetails: data }));
          isValid = true;
        })();
        break;
      default:
        isValid = true;
    }

    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View className='p-7'>
      <StepNavigationBar
        steps={steps}
        currentStep={currentStep}
        vertical={true}
        showIcons
        stepHeight='h-16'
        progressBar
      />

      <View
        flex={1}
        space='$3'
        flexDirection='row'
        justifyContent='flex-end'
        marginTop='$4'
      >
        {currentStep !== steps.length - 1 && (
          <Button
            size='$3.5'
            variant='outlined'
            marginRight='$2'
            onPress={handlePrevious}
            disabled={currentStep === 0}
            icon={<IoIosArrowBack />}
          >
            Previous
          </Button>
        )}

        {currentStep === steps.length - 2 ? (
          <Button
            backgroundColor='$primary'
            size='$3.5'
            disabled={isSubmitting}
            icon={isSubmitting ? () => <Spinner /> : <FaSave />}
            onPress={async () => {
              await documentsUploadFrom.handleSubmit((data) => {
                if (data) {
                  onSubmit(data.documents);
                }
              })();
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        ) : currentStep !== steps.length - 1 ? (
          <Button
            size='$3.5'
            backgroundColor='$primary'
            onPress={handleNext}
            disabled={currentStep === steps.length - 1}
          >
            Next
            <IoIosArrowForward />
          </Button>
        ) : null}
      </View>
    </View>
  );
};

export default SellerRegistrationSteps;
