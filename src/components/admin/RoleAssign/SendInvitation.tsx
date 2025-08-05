'use client';
import { permissions } from '@/constant/permissions';
import usePermission from '@/hook/usePermission';
import { FC, useEffect, useState, ReactElement } from 'react';
import { FaPlus, FaEnvelope, FaTimes } from 'react-icons/fa';
import { YStack, Text, XStack, Button, Input } from 'tamagui';
import Modal from '../../appComponets/modal/PopupModal';
import { ServiceErrorManager } from '@/helpers/service';
import { SendNotificaationsToCreateAdminService } from '@/services/notifications';
import AsyncSelect from '../../appComponets/select/AsyncSelect';
import { useForm, Controller } from 'react-hook-form';

type InvitationFormData = {
  email: string;
  role: string;
};

const SendInvitation: FC = () => {
  const { hasPermission } = usePermission();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvitationFormData>({
    defaultValues: {
      email: '',
      role: '',
    },
  });

  const onSubmit = async (data: InvitationFormData) => {
    setIsSending(true);
    await ServiceErrorManager(
      SendNotificaationsToCreateAdminService({
        data: {
          payload: {
            email: data.email,
            role: data.role,
          },
        },
      }),
      {}
    );

    reset();
    setOpenModal(false);
    setIsSending(false);
  };

  const closeModal = () => {
    setOpenModal(false);
    reset();
  };

  return (
    <XStack padding='$4' justifyContent='flex-end'>
      {hasPermission(
        permissions.CAN_SEND_INVITATION_LINK_ADMIN_SUPER_ADMIN
      ) && (
        <Button
          onPress={() => setOpenModal(true)}
          icon={<FaPlus />}
          color='$text'
          size='$3'
          fontSize='$3'
          marginRight='$2'
          backgroundColor='$primary'
          hoverStyle={{ backgroundColor: '$primaryHover' }}
        >
          Invite User
        </Button>
      )}

      <Modal
        title='Send Invitation'
        description='Enter email address to send invitation link'
        onConfirm={handleSubmit(onSubmit)}
        width={400}
        open={openModal}
        isLoading={isSending}
        confirmButtonProps={{
          backgroundColor: '$primary',
          disabled: isSending,
        }}
        confirmText={isSending ? 'Sending...' : `Send Invitation`}
        onClose={closeModal}
      >
        <YStack space='$3' padding='$2'>
          <Text>Select Role</Text>
          <Controller
            name='role'
            control={control}
            rules={{ required: 'Role is required' }}
            render={({ field }) => (
              <YStack>
                <AsyncSelect
                  size='$3'
                  options={[
                    {
                      label: 'Admin',
                      value: 'admin',
                    },
                    {
                      label: 'Super Admin',
                      value: 'superAdmin',
                    },
                  ]}
                  onChange={(value) => field.onChange(value)}
                  value={field.value}
                />
                {errors.role && (
                  <Text color='$red9' fontSize='$3' marginTop='$1'>
                    {errors.role.message}
                  </Text>
                )}
              </YStack>
            )}
          />

          <Text>Email Address</Text>
          <Controller
            name='email'
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address',
              },
            }}
            render={({ field }) => (
              <YStack>
                <Input
                  size='$3'
                  placeholder='Enter email address'
                  value={field.value}
                  onChangeText={field.onChange}
                  autoCapitalize='none'
                  keyboardType='email-address'
                />
                {errors.email && (
                  <Text color='$red9' fontSize='$3' marginTop='$1'>
                    {errors.email.message}
                  </Text>
                )}
              </YStack>
            )}
          />
        </YStack>
      </Modal>
    </XStack>
  );
};

export default SendInvitation;
