import FileUpload from '@/components/appComponets/fileupload/FileUpload';
import { Product } from '@/types/products';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Separator, SizableText, YStack, Text, XStack } from 'tamagui';

const Attachments = ({ form }: { form: UseFormReturn<Product> }) => {
  return (
    <YStack space='$4'>
      {/* <SizableText size='$5' fontWeight='bold' marginTop='$4'>
        Attachments
      </SizableText>
      <Separator /> */}
      <XStack
        flex={1}
        space='$3'
        flexWrap='wrap'
        //flexDirection='row' space='$10' paddingLeft='$2'
      >
        <YStack space='$2'>
          <Text>Thumbnail</Text>
          <FileUpload
            form={form}
            className='w-full max-w-md mx-auto '
            multiple={false}
            accept={['.jpg', '.jpeg', '.png']}
            name='thumbnail'
            //@ts-ignore
            extraFormFields={{
              rules: { required: 'Thumbnail is required' },
            }}
          />
        </YStack>
      </XStack>
    </YStack>
  );
};

export default Attachments;
