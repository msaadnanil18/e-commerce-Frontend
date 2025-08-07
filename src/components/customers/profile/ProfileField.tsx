import AsyncSelect from '@/components/appComponets/select/AsyncSelect';
import { IUser } from '@/types/auth';
import React, { FC } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { IconType } from 'react-icons';
import { YStack, Label, XStack, Text, Input, Card } from 'tamagui';

interface IProfileField {
  label: string;
  name: string;
  icon: IconType;
  type?: string;
  placeholder: string;
  multiline?: boolean;
  options?: Array<{ value: string; label: string }>;
  isEditing: boolean;
  form: UseFormReturn<IUser>;
}

const ProfileField: FC<IProfileField> = ({
  label,
  name,
  icon: Icon,
  type = 'text',
  placeholder,
  multiline = false,
  options = null,
  isEditing,
  form,
}) => {
  const {
    control,
    watch,
    formState: { errors },
  } = form;

  const validationRules = {
    name: {
      required: 'Name is required',
      minLength: { value: 2, message: 'Name must be at least 2 characters' },
    },
    email: {
      required: 'Email is required',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Invalid email address',
      },
    },
    phone: {
      required: 'Phone number is required',
      pattern: {
        value: /^[\+]?[1-9][\d]{0,15}$/,
        message: 'Invalid phone number',
      },
    },
  };
  return (
    <YStack marginBottom='$2'>
      <Label htmlFor={name}>
        <XStack alignItems='center' space='$2'>
          <Icon size={16} color='$blue10' />
          <Text fontWeight='600' color='$color' fontSize='$3'>
            {label}
          </Text>
        </XStack>
      </Label>

      {isEditing ? (
        <Controller
          control={control}
          name={name}
          rules={validationRules[name as keyof typeof validationRules]}
          render={({ field }) => (
            <YStack space='$2'>
              {options ? (
                <AsyncSelect
                  marginBottom={0}
                  {...field}
                  selectTriggerProps={{
                    borderColor: errors?.[name as keyof IUser]
                      ? '$red8'
                      : '$borderColor',
                  }}
                  size='$4'
                  options={options.map((option) => ({
                    value: option.value,
                    label: option.label,
                  }))}
                />
              ) : (
                <Input
                  id={name}
                  value={field.value}
                  onChangeText={field.onChange}
                  size='$4'
                  borderRadius='$3'
                  placeholder={placeholder}
                  keyboardType={
                    type === 'email'
                      ? 'email-address'
                      : type === 'phone'
                      ? 'phone-pad'
                      : 'default'
                  }
                  borderColor={
                    errors?.[name as keyof IUser] ? '$red8' : '$borderColor'
                  }
                  focusStyle={{
                    borderColor: '$blue8',
                    shadowColor: '$blue5',
                    shadowRadius: 4,
                    shadowOpacity: 0.3,
                  }}
                  multiline={multiline}
                  numberOfLines={multiline ? 3 : 1}
                />
              )}

              {errors[name as keyof IUser] && (
                <Text color='$red10' fontSize='$3'>
                  {errors[name as keyof IUser]?.message}
                </Text>
              )}
            </YStack>
          )}
        />
      ) : (
        <Text fontSize='$4' color='$color'>
          {watch(name) || 'Not specified'}
        </Text>
      )}
    </YStack>
  );
};

export default ProfileField;
