import { ServiceErrorManager } from '@/helpers/service';
import { CreateProductCategoryServie } from '@/services/categories';

import React, { FC, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Button, Input, Spinner, View } from 'tamagui';

const CreateProductCategory: FC<{
  reload?: (r: Record<string, any>) => void;
  type: string;
}> = ({ reload, type }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const CreateCategory = async () => {
    if (inputValue.trim() === '') return;
    setLoading(true);
    const [_, respone] = await ServiceErrorManager(
      CreateProductCategoryServie({
        data: {
          payload: {
            type,
            title: inputValue.toLowerCase(),
          },
        },
      }),
      {
        failureMessage: `Error while adding ${type} `,
      }
    );

    setLoading(false);
    reload?.(respone);
    setInputValue('');
  };
  return (
    <View flex={1} flexDirection='row' space='$3' alignItems='center'>
      <Input onChangeText={(e) => setInputValue(e)} size='$2' />
      <Button
        size='$2'
        margin={0}
        chromeless
        onPress={() => CreateCategory()}
        icon={loading ? <Spinner /> : <FaPlus />}
      />
    </View>
  );
};

export default CreateProductCategory;
