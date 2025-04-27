import Service from '@/helpers/service';

export const SaveAddressService = Service('/address/create');

export const SetDefaultAddressService = Service('/address/set-default-address');

export const AddressListService = Service('/address/list');

export const getDefaultAddressService = Service('/address/get/defaul-address');
