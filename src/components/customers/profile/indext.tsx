'use client';

import { useScreen } from '@/hook/useScreen';
import CustomerSideBar from '../CustomerSideBar';
import React, { FC, useState } from 'react';
import {
  XStack,
  Text,
  Button,
  Avatar,
  Circle,
  YStack,
  ScrollView,
  Spinner,
} from 'tamagui';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit3,
  FiSave,
  FiX,
  FiCamera,
  FiSettings,
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store/store';
import { useForm } from 'react-hook-form';
import { IUser } from '@/types/auth';
import ProfileField from './ProfileField';
import FileUpload from '@/components/appComponets/fileupload/FileUpload';
import useFileUpload from '@/components/appComponets/fileupload/useFileUpload';
import { getRealFiles } from '@/helpers/utils';
import { ServiceErrorManager } from '@/helpers/service';
import { UserProfileUpdate } from '@/services/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '@/states/slices/authSlice';
import RenderDriveFile from '@/components/appComponets/fileupload/RenderDriveFile';

const Profile: FC = () => {
  const dispatch = useDispatch();
  const { getFileUpload } = useFileUpload();
  const { user } = useSelector((state: RootState) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const screen = useScreen();

  const form = useForm<IUser>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      gender: user?.gender || '',
    },
    mode: 'onChange',
  });

  const watch = form.watch;
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const onSubmit = async (data: IUser) => {
    setIsLoading(true);
    const { avatar, ...resData } = data;
    const newAvatarImage = getRealFiles([avatar]);
    let uplodedAvatar: Array<Record<string, any>> = [];
    if (newAvatarImage.length > 0) {
      uplodedAvatar = await getFileUpload(newAvatarImage);
    }

    const [_, response] = await ServiceErrorManager(
      UserProfileUpdate({
        data: {
          ...resData,
          avatar: uplodedAvatar?.[0] || avatar,
        },
      }),
      { successMessage: 'Your profile is updated successfully' }
    );

    if (response.data) {
      dispatch(setUser(response.data.user));
      localStorage.setItem('sessionToken', response.data.sessionToken);
    }
    setIsLoading(false);
    setIsEditing(false);
  };

  return (
    <div className={screen.xs ? 'admin-container' : 'customer-container'}>
      <CustomerSideBar />
      <YStack flex={1}>
        <XStack
          paddingVertical='$4'
          paddingHorizontal='$5'
          alignItems='center'
          space='$4'
          borderBottomWidth={1}
          borderBottomColor='$borderColor'
        >
          <Text
            fontSize='$4'
            fontWeight='bold'
            marginLeft={screen.xs ? '$10' : ''}
          >
            Profile Information
          </Text>
        </XStack>
        <ScrollView
          scrollbarWidth='thin'
          flex={1}
          contentContainerStyle={{ paddingBottom: 40 }}
          backgroundColor='$background'
        >
          <XStack flex={1} flexDirection={screen.xs ? 'column' : 'row'}>
            <XStack
              padding='$2'
              flex={1}
              justifyContent={screen.xs ? 'center' : 'flex-end'}
            >
              <YStack alignItems='center' paddingVertical='$1'>
                <XStack position='relative'>
                  <Avatar
                    circular
                    size='$8'
                    backgroundColor='$blue5'
                    pressStyle={{ scale: 0.95 }}
                  >
                    {!isEditing && user?.avatar ? (
                      <RenderDriveFile file={user.avatar} />
                    ) : isEditing && watch('avatar') ? (
                      <img
                        className=' cursor-pointer'
                        onClick={() => {
                          document.getElementById('profileAvatar')?.click();
                        }}
                        src={URL.createObjectURL(watch('avatar'))}
                      />
                    ) : isEditing && user?.avatar ? (
                      <RenderDriveFile file={user.avatar} />
                    ) : (
                      <Text color='$blue11' fontSize='$6' fontWeight='700'>
                        {getInitials(watch('name') || user?.name || 'U')}
                      </Text>
                    )}
                  </Avatar>

                  {isEditing && (
                    <Circle
                      position='absolute'
                      bottom={0}
                      right={0}
                      size='$3'
                      backgroundColor='$blue10'
                      borderWidth={2}
                      borderColor='$background'
                      pressStyle={{ scale: 0.9 }}
                      cursor='pointer'
                      // onPress={handleImageUpload}
                      shadowColor='$shadowColor'
                      shadowRadius={4}
                      shadowOpacity={0.2}
                    >
                      <FileUpload
                        id='profileAvatar'
                        multiple={false}
                        form={form}
                        name='avatar'
                        showFileList={false}
                        accept={['.jpg', '.jpeg']}
                        variant='icon'
                        uploadIcon={<FiCamera size={16} color='white' />}
                      />
                      {/* <FiCamera size={16} color='white' /> */}
                    </Circle>
                  )}
                </XStack>
                <YStack alignItems='center'>
                  <Text fontSize='$4' fontWeight='700'>
                    {watch('name') || user?.name || 'User Name'}
                  </Text>
                  <Text fontSize='$3'>
                    {watch('email') || user?.email || 'email@example.com'}
                  </Text>
                </YStack>
              </YStack>
            </XStack>
            <XStack
              flex={1}
              justifyContent={screen.xs ? 'center' : 'flex-end'}
              padding='$4'
            >
              <XStack space='$2'>
                {/* <Button
                  size='$3'
                  variant='outlined'
                  icon={FiSettings}
                  // onPress={() => setShowSettingsSheet(true)}
                  circular
                /> */}
                <Button
                  size='$3'
                  variant={isEditing ? 'outlined' : undefined}
                  icon={isEditing ? FiX : FiEdit3}
                  onPress={() => {
                    setIsEditing((prev) => {
                      form.reset({
                        name: user?.name || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                        gender: user?.gender || '',
                      });
                      return !prev;
                    });
                  }}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
                {isEditing && (
                  <Button
                    size='$3'
                    backgroundColor='$primary'
                    icon={isLoading ? <Spinner size='small' /> : FiSave}
                    onPress={form.handleSubmit(onSubmit)}
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </Button>
                )}
              </XStack>
            </XStack>
          </XStack>

          <YStack space='$2' flex={1} paddingHorizontal='$4'>
            <ProfileField
              label='Full Name'
              name='name'
              icon={FiUser}
              placeholder='Enter your full name'
              form={form}
              isEditing={isEditing}
            />
            <ProfileField
              label='Email Address'
              name='email'
              icon={FiMail}
              type='email'
              placeholder='Enter your email address'
              form={form}
              isEditing={false}
            />
            <ProfileField
              label='Phone Number'
              name='phone'
              icon={FiPhone}
              type='phone'
              placeholder='Enter your phone number'
              form={form}
              isEditing={isEditing}
            />
            <ProfileField
              label='Gender'
              name='gender'
              icon={FiUser}
              placeholder='Select your gender'
              form={form}
              isEditing={isEditing}
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Other', value: 'other' },
                { label: 'Prefer not to say', value: 'not_specified' },
              ]}
            />
          </YStack>
        </ScrollView>
      </YStack>
    </div>
  );
};

export default Profile;
