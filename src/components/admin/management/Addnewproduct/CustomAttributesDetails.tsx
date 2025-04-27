import React from 'react';
import { useFieldArray, Controller, Control } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Button, Input, XStack, YStack } from 'tamagui';

interface CustomAttributesDetailsProps {
  control: Control<any>;
  index: number;
}

const CustomAttributesDetails = ({
  control,
  index,
}: CustomAttributesDetailsProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${index}.attributes`,
  });

  return (
    <YStack space='$3'>
      {fields.map((field, attributeIndex) => (
        <XStack key={field.id} space='$2' marginBottom='$2' alignItems='center'>
          <Controller
            name={`variants.${index}.attributes.${attributeIndex}.key`}
            control={control}
            rules={{ required: 'Key is required' }}
            render={({ field }) => (
              <Input
                placeholder='Enter Key'
                value={field.value}
                onChangeText={field.onChange}
                flex={1}
              />
            )}
          />

          <Controller
            name={`variants.${index}.attributes.${attributeIndex}.value`}
            control={control}
            rules={{ required: 'Value is required' }}
            render={({ field }) => (
              <Input
                placeholder='Enter Value'
                value={field.value}
                onChangeText={field.onChange}
                flex={1}
              />
            )}
          />

          <Button
            size='$2'
            icon={<FiTrash2 size={16} />}
            onPress={() => remove(attributeIndex)}
          />
        </XStack>
      ))}

      <Button
        icon={<FiPlus />}
        onPress={() => append({ key: '', value: '' })}
        variant='outlined'
      >
        {fields.length > 0 ? 'Add More' : 'Add Detail'}
      </Button>
    </YStack>
  );
};

export default CustomAttributesDetails;
