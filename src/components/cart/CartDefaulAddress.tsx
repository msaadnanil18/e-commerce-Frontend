'use client';
import { IAddress } from '@/types/address';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import {
  Card,
  View,
  Text,
  Button,
  YStack,
  RadioGroup,
  XStack,
  Separator,
  Spinner,
} from 'tamagui';
import Modal from '../appComponets/modal/PopupModal';
import useGetAddressList from '../checkout/hook/useGetAddressList';
import { SetDefaultAddressService } from '@/services/address';
import { ServiceErrorManager } from '@/helpers/service';

const CartDefaulAddress: FC<{
  defaultAddres: IAddress | null;
  reload: () => void;
}> = ({ defaultAddres, reload }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  return (
    <Card bordered marginBottom='$4' padding='$3'>
      <View
        flex={1}
        flexDirection='row'
        alignItems='center'
        justifyContent='space-between'
        gap='$3'
      >
        <View flex={1}>
          <View
            flexDirection='row'
            spaceDirection='vertical'
            gap='$2'
            alignItems='center'
          >
            <Text fontSize={12}>Deliver To:</Text>
            <Text fontSize='$3' fontWeight='bold'>
              {defaultAddres?.name}, {defaultAddres?.postalCode}
            </Text>
          </View>
          <View flex={1}>
            <Text numberOfLines={2} fontSize={12} color='$gray10'>
              {defaultAddres?.street}, {defaultAddres?.city},{' '}
              {defaultAddres?.state}
            </Text>
          </View>
        </View>
        {openModal && <AddressPopup {...{ openModal, setOpenModal, reload }} />}

        <Button onPress={() => setOpenModal(true)} variant='outlined' size='$3'>
          Change
        </Button>
      </View>
    </Card>
  );
};

export default CartDefaulAddress;

const AddressPopup: FC<{
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  reload: () => void;
}> = ({ openModal, setOpenModal, reload }) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const { loading, addressList } = useGetAddressList({ setSelectedAddressId });
  const [selectionLoading, setSelectionLoading] = useState<boolean>(false);
  const handleAddressSelection = (value: string) => {
    if (!value) return;
    setSelectionLoading(true);
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
    ).finally(() => {
      setOpenModal(false);
      setSelectionLoading(false);
      reload();
    });
  };
  return (
    <Modal
      width={400}
      title='Select Delivery Address'
      open={openModal}
      onClose={setOpenModal}
    >
      {loading ? (
        <Spinner />
      ) : (
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
                    <YStack flex={1}>
                      <XStack
                        justifyContent='space-between'
                        alignItems='center'
                      >
                        <Text fontWeight='bold' fontSize={12}>
                          {address?.name}
                        </Text>
                      </XStack>
                      <Text numberOfLines={2} fontSize={10} color='$gray10'>
                        {address.street}, {address.city}, {address.state}{' '}
                        {address.postalCode}
                      </Text>
                      {address.landmark && (
                        <Text fontSize={10} color='$gray10'>
                          Landmark: {address.landmark}
                        </Text>
                      )}
                      <XStack marginTop='$1'>
                        <Text fontSize={10} color='$gray10'>
                          {address.phoneNumber}
                        </Text>
                      </XStack>
                    </YStack>
                  </XStack>

                  {index < addressList.length - 1 && (
                    <Separator marginVertical='$2' />
                  )}
                </YStack>
              ))}
            </YStack>
          </RadioGroup>
        </YStack>
      )}
    </Modal>
  );
};
