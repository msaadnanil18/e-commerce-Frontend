'use client';

import { ServiceErrorManager } from '@/helpers/service';
import { AddressListService } from '@/services/address';
import { IAddress } from '@/types/address';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';

const useGetAddressList = ({
  setSelectedAddressId,
}: {
  setSelectedAddressId?: Dispatch<SetStateAction<string>>;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [addressList, setAddressList] = useState<Array<IAddress>>([]);
  const fetchAddressList = () => {
    setLoading(true);
    ServiceErrorManager(AddressListService(), {})
      .then(([_, response]) => {
        setAddressList(response.docs);
        if (response.docs && response.docs.length > 0) {
          setSelectedAddressId &&
            setSelectedAddressId(
              (response.docs || []).find(
                (address: IAddress) => address.isDefault
              )?._id
            );
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAddressList();
  }, []);

  return { loading, addressList };
};

export default useGetAddressList;
