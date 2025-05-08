import React, { FC } from 'react';
import FileUpload from '@/components/appComponets/fileupload/FileUpload';
import { YStack, Text, Separator } from 'tamagui';
import { validateRequired } from '.';
import { UseFormReturn } from 'react-hook-form';

const SellerDocument: FC<{
  form: UseFormReturn;
}> = ({ form }) => {
  return (
    <YStack space='$4'>
      <Text fontWeight='bold' fontSize='$4' color='$blue10'>
        Documents
      </Text>
      <Separator />

      <YStack space='$2'>
        <Text>
          Upload business documents (PAN card, registration certificate, etc.)
        </Text>
      </YStack>
      <FileUpload
        accept={['.pdf', '.jpg', '.jpeg', '.png']}
        variant='default'
        multiple
        enableDragDrop
        maxFiles={10}
        maxSize={1000}
        className='w-full max-w-md mx-auto '
        form={form}
        name='documents'
        //@ts-ignore
        extraFormFields={{ rules: { validate: validateRequired } }}
        //  onFileChange={(file) => handelOnGetFile(file)}
      />
    </YStack>
  );
};

export default SellerDocument;
