import FileUpload from '@/components/appComponets/fileupload/FileUpload';
import { Product } from '@/types/products';
import { UseFormReturn } from 'react-hook-form';
import { Text, XStack, YStack } from 'tamagui';

const Attachments = ({ form }: { form: UseFormReturn<Product> }) => {
  return (
    <YStack space='$4'>
      <XStack flex={1} space='$3' flexWrap='wrap'>
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
