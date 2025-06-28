'use client';

import Modal from '@/components/appComponets/modal/PopupModal';
import AsyncSelect from '@/components/appComponets/select/AsyncSelect';
import { ServiceErrorManager } from '@/helpers/service';
import { ProductApprovalandRejectionService } from '@/services/products';
import { IProduct } from '@/types/products';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { IoCheckmark, IoClose } from 'react-icons/io5';
import { Button, Card, TextArea, XStack, YStack, Text } from 'tamagui';

const AdminActionButtons: FC<{
  product: IProduct | null;
  imageModalOpen: boolean;
  setImageModalOpen: Dispatch<SetStateAction<boolean>>;
  currentImageIndex: number;
  setCurrentImageIndex: Dispatch<SetStateAction<number>>;
  fetchProductDetails: () => void;
}> = ({
  product,
  imageModalOpen,
  setImageModalOpen,
  setCurrentImageIndex,
  currentImageIndex,
  fetchProductDetails,
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectionOption, setRejectionOption] = useState<string | null>(null);

  const [description, setDescription] = useState<string>('');
  const handleApprove = async () => {
    if (!product?._id) return;
    setIsSubmitting(true);
    await ServiceErrorManager(
      ProductApprovalandRejectionService({
        data: {
          query: {
            _id: product?._id,
          },
          payload: {
            status: 'approved',
            isApproved: true,
            rejectionReason: description,
          },
        },
      }),
      {
        successMessage: 'The product is updated',
      }
    );
    setApproveDialogOpen(false);
    fetchProductDetails();
  };

  const handleReject = async () => {
    if (!product?._id) return;
    setIsSubmitting(true);
    await ServiceErrorManager(
      ProductApprovalandRejectionService({
        data: {
          query: {
            _id: product?._id,
          },
          payload: {
            status: rejectionOption,
            isApproved: false,
            rejectionReason: rejectReason,
          },
        },
      }),
      {
        successMessage: 'The product is updated',
      }
    );

    setRejectDialogOpen(false);
    setIsSubmitting(false);
    fetchProductDetails();
  };

  return (
    <YStack>
      <XStack space='$4' justifyContent='space-between'>
        <Button
          flex={1}
          size='$4'
          backgroundColor='$green9'
          color='white'
          icon={IoCheckmark}
          disabled={product?.status === 'approved' || isSubmitting}
          opacity={product?.status === 'approved' ? 0.5 : 1}
          onPress={() => setApproveDialogOpen(true)}
        >
          {product?.status === 'approved'
            ? 'Already Approved'
            : 'Approve Product'}
        </Button>

        <Button
          flex={1}
          size='$4'
          backgroundColor='$red9'
          color='white'
          icon={IoClose}
          disabled={product?.status === 'rejected' || isSubmitting}
          opacity={product?.status === 'rejected' ? 0.5 : 1}
          onPress={() => setRejectDialogOpen(true)}
        >
          {product?.status === 'rejected'
            ? 'Already Rejected'
            : 'Reject Product'}
        </Button>
      </XStack>

      {product?.status === 'rejected' && product?.reason && (
        <Card backgroundColor='$red2' padding='$3' marginTop='$4'>
          <Text fontWeight='bold' color='$red10' marginBottom='$1'>
            Rejection Reason:
          </Text>
          <Text color='$red9'>{product.reason}</Text>
        </Card>
      )}

      <Modal
        width={400}
        title='Approve Product'
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        isLoading={isSubmitting}
        confirmButtonProps={{ backgroundColor: '$green9', color: 'white' }}
        confirmText='Approve'
        onConfirm={handleApprove}
        description='Are you sure you want to approve this product? This will make the product visible to customers.'
      >
        <YStack marginTop='$3'>
          <TextArea
            placeholder={`Enter Description `}
            value={description}
            onChangeText={setDescription}
            minHeight={100}
          />
        </YStack>
      </Modal>

      <Modal
        width={400}
        title='Reject Product'
        open={rejectDialogOpen}
        onClose={() => {
          setRejectDialogOpen(false);
          setRejectionOption(null);
          setRejectReason('');
        }}
        isLoading={isSubmitting}
        confirmButtonProps={{
          backgroundColor: '$red9',
          color: 'white',
          disabled: !rejectReason.trim(),
        }}
        confirmText='Reject'
        onConfirm={handleReject}
      >
        <YStack marginTop='$3'>
          <AsyncSelect
            options={[
              { value: 'rejected', label: 'Rejected' },
              { value: 'restricted', label: 'Restricted' },
              { value: 'suspended', label: 'Suspended' },
            ]}
            onChange={(value) => setRejectionOption(value)}
            value={rejectionOption || product?.status}
            placeholder='Select rejection option'
          />

          {rejectionOption && (
            <TextArea
              placeholder={`Enter ${rejectionOption} reason`}
              value={rejectReason}
              onChangeText={setRejectReason}
              minHeight={100}
            />
          )}

          {!rejectReason.trim() && (
            <Text color='$red9' fontSize='$1' marginTop='$1'>
              Rejection reason is required
            </Text>
          )}
        </YStack>
      </Modal>
    </YStack>
  );
};

export default AdminActionButtons;
