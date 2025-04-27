'use client';
import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../organism/AdminSidebar';
import { Controller, UseFormReturn } from 'react-hook-form';

import {
  Form,
  Text,
  SizableText,
  Input,
  Button,
  Separator,
  Card,
  YStack,
  Spinner,
  ScrollView,
  TextArea,
  View,
} from 'tamagui';
import { Product } from '@/types/products';
import { FaSave } from 'react-icons/fa';

import AsyncSelect from '@/components/appComponets/select/AsyncSelect';
import ProductVariants from './ProductVariants';
import BasicInformation from './BasicInformation';
import QuantityRules from './ QuantityRules';
import PhysicalAttributes from './PhysicalAttributes';
import SellerDetails from './SellerDetails';
import Modal from '@/components/appComponets/modal/PopupModal';

interface AddnewproductProps {
  form: UseFormReturn<Product>;
  onSubmit: (r: Product) => void;
  isEdit?: boolean;
  loading?: boolean;
}
const Addnewproduct: FC<AddnewproductProps> = ({
  loading = false,
  ...props
}) => {
  return (
    <div className='admin-container'>
      <AdminSidebar />
      {loading ? (
        <View flex={1} justifyContent='center' alignItems='center' padding='$4'>
          <Spinner size='large' color='$blue10' />
          <Text marginTop='$4'>Loading product details...</Text>
        </View>
      ) : (
        <ScrollView>
          <Card padding='$4' backgroundColor='$background'>
            <AddProduct {...props} />
          </Card>
        </ScrollView>
      )}
    </div>
  );
};

export default Addnewproduct;

const AddProduct: FC<AddnewproductProps> = ({
  form,
  onSubmit,
  isEdit = false,
}) => {
  const router = useRouter();
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <YStack space='$4'>
        <BasicInformation form={form} />
        <ProductVariants form={form} />
        <QuantityRules form={form} />
        <PhysicalAttributes form={form} />

        <SellerDetails form={form} />

        <SizableText size='$5' fontWeight='bold' marginTop='$4'>
          Tax Information
        </SizableText>
        <Separator />

        <YStack space='$2'>
          <Text>HSN Code *</Text>
          <Controller
            name='hsnCode'
            control={control}
            rules={{ required: 'HSN Code is required' }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Enter HSN Code'
                borderColor={errors.hsnCode ? '$red10' : undefined}
              />
            )}
          />
          {errors.hsnCode && (
            <Text color='$red10'>{errors.hsnCode.message}</Text>
          )}
        </YStack>

        <YStack space='$2'>
          <Text>Tax Type *</Text>
          <Controller
            name='taxType'
            control={control}
            rules={{ required: 'Tax type is required' }}
            render={({ field }) => (
              <AsyncSelect
                options={[
                  { label: 'Inclusive', value: 'inclusive' },
                  { label: 'Exclusive', value: 'exclusive' },
                ]}
                {...field}
              />
            )}
          />
          {errors.taxType && (
            <Text color='$red10'>{errors.taxType.message}</Text>
          )}
        </YStack>

        <Modal
          width={400}
          title='Confirm Before Editing'
          description='Editing this product will overwrite existing details. Make sure to review changes carefully before saving. Do you want to proceed?'
          open={openConfirmModal}
          onClose={setOpenConfirmModal}
          onConfirm={async () => {
            await handleSubmit(onSubmit)();
          }}
          isLoading={isSubmitting}
          confirmButtonProps={{
            backgroundColor: '$primary',
          }}
        >
          <YStack space='$2' marginTop='$3'>
            <Text>Enter Edit Reason *</Text>
            <Controller
              name='reason'
              control={control}
              rules={{ required: 'Edit reason is required' }}
              render={({ field }) => (
                <TextArea
                  {...field}
                  placeholder='Enter Edit Reason'
                  borderColor={errors.hsnCode ? '$red10' : undefined}
                />
              )}
            />
            {errors.hsnCode && (
              <Text color='$red10'>{errors.hsnCode.message}</Text>
            )}
          </YStack>
        </Modal>

        <Button
          onPress={() => {
            if (isEdit) {
              setOpenConfirmModal(true);
            } else {
              handleSubmit(onSubmit)();
            }
          }}
          marginTop='$4'
          alignSelf='flex-end'
          icon={isSubmitting ? <Spinner /> : <FaSave />}
          size='$4'
          disabled={isSubmitting}
          backgroundColor='$primary'
        >
          {isSubmitting ? 'Saving...' : `${isEdit ? 'Edit' : 'Save'} Product`}
        </Button>
      </YStack>
    </Form>
  );
};
