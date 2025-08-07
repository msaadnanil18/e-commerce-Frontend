'use client';

import { ServiceErrorManager } from '@/helpers/service';
import {
  SaveAddressService,
  SetDefaultAddressService,
} from '@/services/address';
import { AddressFormValues, IAddress } from '@/types/address';
import { FC, useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  RadioGroup,
  Button,
  Separator,
  ScrollView,
  View,
} from 'tamagui';

import { RiEdit2Fill } from 'react-icons/ri';
import { FaPlus } from 'react-icons/fa';
import ShippingAddressForm from '../customers/ShippingAddressForm';
import { useForm } from 'react-hook-form';
import { debounce } from 'lodash-es';
import useGetAddressList from './hook/useGetAddressList';
import { useRouter } from 'next/navigation';

const AddressSkeleton = ({ count = 3 }) => {
  return (
    <YStack space='$4'>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <YStack key={index} space='$2'>
            <XStack>
              <View
                width='$4'
                height='$4'
                backgroundColor='$gray5'
                marginRight='$3'
                marginTop='$3'
              />
              <YStack flex={1} space='$2'>
                <View
                  width='40%'
                  height='$4'
                  backgroundColor='$gray5'
                  borderRadius='$2'
                />
                <View
                  width='90%'
                  height='$3'
                  backgroundColor='$gray5'
                  borderRadius='$2'
                />
                <View
                  width='60%'
                  height='$3'
                  backgroundColor='$gray5'
                  borderRadius='$2'
                />
                <View
                  width='30%'
                  height='$3'
                  backgroundColor='$gray5'
                  borderRadius='$2'
                  marginTop='$1'
                />
                <XStack marginTop='$3' marginBottom='$2'>
                  <View
                    width='70%'
                    height='$8'
                    backgroundColor='$gray5'
                    borderRadius='$2'
                  />
                </XStack>
              </YStack>
            </XStack>
            {index < count - 1 && <Separator marginVertical='$2' />}
          </YStack>
        ))}
    </YStack>
  );
};

const AddressList: FC<{
  disableDiliveryAddressButton?: boolean;
  smallscreen?: boolean;
}> = ({ disableDiliveryAddressButton = false, smallscreen }) => {
  const router = useRouter();
  const form = useForm<AddressFormValues>();
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [selectionLoading, setSelectionLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isNewAddress, setIsNewAddress] = useState<boolean>(false);
  const { loading, addressList, reload } = useGetAddressList({
    setSelectedAddressId,
  });

  const handleAddressSelection = (value: string) => {
    if (!value) return;
    setSelectionLoading(true);
    setIsEdit(false);
    setEditId('');
    setSelectedAddressId(value);
    ServiceErrorManager(
      SetDefaultAddressService({
        data: {
          query: {
            _id: value,
          },
        },
      }),
      {}
    ).finally(() => setSelectionLoading(false));
  };

  const handleEdit = (addressId: string) => {
    setIsEdit(true);
    setEditId(addressId);
    form.reset(addressList.find((address) => address._id === addressId));
  };

  const handleSaveAddress = async (addressData: Record<string, any>) => {
    setSubmitLoading(true);
    const [err, data] = await ServiceErrorManager(
      SaveAddressService({
        data: {
          payload: addressData,
        },
      }),
      {}
    );

    if (err) return;
    setSubmitLoading(false);
    setIsEdit(false);
    if (!disableDiliveryAddressButton) {
      router.push(`/checkout?delivery-address=${data._id || addressData._id}`);
    }
    reload();
  };

  const handelOnNewAddressSave = debounce(() => {
    setIsNewAddress(true);
  }, 230);

  return (
    <YStack paddingHorizontal='$3' space='$4'>
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
          marginLeft={smallscreen ? '$10' : ''}
          fontWeight='bold'
        >
          Select Delivery Address
        </Text>
      </XStack>

      {loading ? (
        <ScrollView scrollbarWidth='thin'>
          <AddressSkeleton />
        </ScrollView>
      ) : addressList.length === 0 ? (
        <YStack alignItems='center' paddingVertical='$6'>
          <Text>No addresses found. Please add a new address.</Text>
        </YStack>
      ) : (
        <ScrollView scrollbarWidth='thin'>
          <YStack opacity={selectionLoading ? 0.3 : 1}>
            <RadioGroup
              value={selectedAddressId}
              onValueChange={handleAddressSelection}
              name='addressSelection'
            >
              <YStack>
                {(addressList || []).map((address, index) => (
                  <YStack key={address._id}>
                    <XStack>
                      <RadioGroup.Item
                        value={address?._id}
                        id={address._id}
                        marginRight='$3'
                        alignSelf='flex-start'
                        marginTop='$3'
                      >
                        <RadioGroup.Indicator />
                      </RadioGroup.Item>
                      {isEdit && address._id === editId ? (
                        <YStack flex={1}>
                          <ShippingAddressForm
                            isLoading={submitLoading}
                            onSave={handleSaveAddress}
                            form={form}
                            onCancel={() => {
                              form.reset({});
                              setIsEdit(false);
                              setEditId('');
                            }}
                            onSaveButtonText={`${
                              disableDiliveryAddressButton
                                ? 'SAVE'
                                : 'SAVE AND DELEVER HERE'
                            }`}
                          />
                        </YStack>
                      ) : (
                        <YStack flex={1} space='$2'>
                          <XStack
                            justifyContent='space-between'
                            alignItems='center'
                          >
                            <Text fontWeight='bold'>{address?.name}</Text>
                            {selectedAddressId === address._id && (
                              <Button
                                size='$3'
                                variant='outlined'
                                onPress={() => handleEdit(address._id)}
                                chromeless
                              >
                                <XStack
                                  flex={1}
                                  alignItems='center'
                                  spaceDirection='horizontal'
                                  gap='$2'
                                  flexDirection='row'
                                >
                                  <Text color='$linkColor'>Edit</Text>
                                  <Text color='$linkColor'>
                                    <RiEdit2Fill />
                                  </Text>
                                </XStack>
                              </Button>
                            )}
                          </XStack>
                          <Text numberOfLines={2} fontSize='$3' color='$gray10'>
                            {address.street}, {address.city}, {address.state}{' '}
                            {address.postalCode}
                          </Text>
                          {address.landmark && (
                            <Text fontSize='$3' color='$gray10'>
                              Landmark: {address.landmark}
                            </Text>
                          )}
                          <XStack marginTop='$1'>
                            <Text fontSize='$3' color='$gray10'>
                              {address.phoneNumber}
                            </Text>
                          </XStack>

                          {!disableDiliveryAddressButton &&
                            selectedAddressId === address._id && (
                              <XStack
                                justifyContent='space-between'
                                marginTop='$3'
                                marginBottom='$2'
                              >
                                <Button
                                  backgroundColor='$primary'
                                  size='$3'
                                  onPress={() =>
                                    router.push(
                                      `/checkout?delivery-address=${address._id}`
                                    )
                                  }
                                  flexBasis='70%'
                                >
                                  Deliver to this Address
                                </Button>
                              </XStack>
                            )}
                        </YStack>
                      )}
                    </XStack>

                    {index < addressList.length - 1 && (
                      <Separator marginVertical='$2' />
                    )}
                  </YStack>
                ))}
              </YStack>
            </RadioGroup>
          </YStack>
        </ScrollView>
      )}

      {isNewAddress ? (
        <YStack flex={1}>
          <ShippingAddressForm
            isLoading={submitLoading}
            onSave={handleSaveAddress}
            form={form}
            onCancel={() => {
              form.reset({});
              setIsNewAddress(false);
            }}
            onSaveButtonText={`${
              disableDiliveryAddressButton ? 'SAVE' : 'SAVE AND DELEVER HERE'
            }`}
          />
        </YStack>
      ) : (
        <YStack marginTop='$4'>
          <Button
            size='$3'
            onPress={() => {
              form.reset({});
              handelOnNewAddressSave();
            }}
            icon={<FaPlus />}
          >
            Add a new address
          </Button>
        </YStack>
      )}
    </YStack>
  );
};

export default AddressList;
