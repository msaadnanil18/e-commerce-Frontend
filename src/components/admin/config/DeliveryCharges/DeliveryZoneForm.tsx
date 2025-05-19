'use client';
import { DeliveryZone } from '@/types/deliverZone';
import { FC, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { FaSave } from 'react-icons/fa';
import {
  FiBox,
  FiClock,
  FiMapPin,
  FiPackage,
  FiPlusCircle,
  FiTag,
  FiTrash2,
} from 'react-icons/fi';
import {
  Button,
  Card,
  H6,
  Input,
  Label,
  ScrollView,
  Separator,
  Spinner,
  Text,
  XStack,
  YStack,
} from 'tamagui';

const DeliveryZoneForm: FC<{
  form: UseFormReturn<DeliveryZone>;
  isEditing?: boolean;
  onSubmit: (r: DeliveryZone) => void;
  isLoading: boolean;
}> = ({ isEditing = false, form, onSubmit, isLoading }) => {
  const [newRegion, setNewRegion] = useState('');
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const regions = watch('regions');
  const addRegion = () => {
    if (newRegion.trim() && !regions.includes(newRegion.trim())) {
      setValue('regions', [...regions, newRegion.trim()]);
      setNewRegion('');
    }
  };

  const removeRegion = (index: number) => {
    const updatedRegions = [...regions];
    updatedRegions.splice(index, 1);
    setValue('regions', updatedRegions);
  };

  return (
    <YStack padding='$4' space='$4'>
      <XStack justifyContent='space-between' alignItems='center'>
        <H6>{isEditing ? 'Edit Delivery Zone' : 'Create Delivery Zone'}</H6>
      </XStack>
      <Separator />
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack space='$4' padding='$3' paddingBottom='$8'>
          <YStack space='$2'>
            <Label htmlFor='name'>
              <XStack space='$2' alignItems='center'>
                <FiTag size={16} />
                <Text>Zone Name</Text>
              </XStack>
            </Label>
            <Controller
              control={control}
              name='name'
              rules={{ required: 'Zone name is required' }}
              render={({ field }) => (
                <Input
                  id='name'
                  placeholder='e.g. South Delhi'
                  value={field.value}
                  onChangeText={field.onChange}
                  size='$4'
                  borderColor={errors.name ? '$red8' : undefined}
                />
              )}
            />
            {errors.name && (
              <Text color='$red10' fontSize='$2'>
                {errors.name.message}
              </Text>
            )}
          </YStack>

          <YStack space='$2'>
            <Label>
              <XStack space='$2' alignItems='center'>
                <FiMapPin size={16} />
                <Text>Regions</Text>
              </XStack>
            </Label>

            <XStack space='$2'>
              <Input
                placeholder='Add a region'
                value={newRegion}
                onChangeText={setNewRegion}
                flex={1}
                size='$4'
              />
              <Button
                size='$4'
                icon={<FiPlusCircle size={18} />}
                onPress={addRegion}
              >
                Add
              </Button>
            </XStack>

            <Card padding='$2' bordered>
              <ScrollView maxHeight={120} showsVerticalScrollIndicator={false}>
                <YStack space='$1' padding='$1'>
                  {regions.length === 0 ? (
                    <Text padding='$2'>No regions added</Text>
                  ) : (
                    regions.map((region, index) => (
                      <XStack
                        key={index}
                        justifyContent='space-between'
                        alignItems='center'
                        padding='$2'
                      >
                        <Text>{region}</Text>
                        <Button
                          size='$2'
                          circular
                          onPress={() => removeRegion(index)}
                          icon={<FiTrash2 size={14} />}
                        />
                      </XStack>
                    ))
                  )}
                </YStack>
              </ScrollView>
            </Card>

            {errors.regions && (
              <Text color='$red10' fontSize='$2'>
                {errors.regions.message}
              </Text>
            )}
          </YStack>

          <YStack space='$2'>
            <Label htmlFor='baseCharge'>
              <XStack space='$2' alignItems='center'>
                <Text>₹ Base Charge</Text>
              </XStack>
            </Label>

            <Controller
              control={control}
              name='baseCharge'
              rules={{
                required: 'Base charge is required',
                min: { value: 0, message: 'Must be 0 or greater' },
                pattern: {
                  value: /^\d*\.?\d{0,2}$/,
                  message: 'Enter a valid number',
                },
              }}
              render={({ field }) => (
                <Input
                  id='baseCharge'
                  placeholder='0.00'
                  value={field.value?.toString() ?? ''}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9.]/g, '');
                    field.onChange(parseFloat(cleaned) || 0);
                  }}
                  keyboardType='decimal-pad'
                  size='$4'
                  borderColor={errors.baseCharge ? '$red8' : undefined}
                />
              )}
            />
            {errors.baseCharge && (
              <Text color='$red10' fontSize='$2'>
                {errors.baseCharge.message}
              </Text>
            )}
          </YStack>

          <YStack space='$2'>
            <Label htmlFor='weightRate'>
              <XStack space='$2' alignItems='center'>
                <FiPackage size={16} />
                <Text>Weight Rate ( per kg)</Text>
              </XStack>
            </Label>
            <Controller
              control={control}
              name='weightRate'
              rules={{
                required: 'Weight rate is required',
                min: { value: 0, message: 'Must be 0 or greater' },
                pattern: {
                  value: /^\d*\.?\d{0,2}$/,
                  message: 'Enter a valid number',
                },
              }}
              render={({ field }) => (
                <Input
                  id='weightRate'
                  placeholder='0.00'
                  value={field.value.toString()}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9.]/g, '');
                    field.onChange(parseFloat(cleaned) || 0);
                  }}
                  keyboardType='numeric'
                  size='$4'
                  borderColor={errors.weightRate ? '$red8' : undefined}
                />
              )}
            />
            {errors.weightRate && (
              <Text color='$red10' fontSize='$2'>
                {errors.weightRate.message}
              </Text>
            )}
          </YStack>

          {/* Volumetric rate field */}
          <YStack space='$2'>
            <Label htmlFor='volumetricRate'>
              <XStack space='$2' alignItems='center'>
                <FiBox size={16} />
                <Text>Volumetric Rate (per m³)</Text>
              </XStack>
            </Label>
            <Controller
              control={control}
              name='volumetricRate'
              rules={{
                required: 'Volumetric rate is required',
                min: { value: 0, message: 'Must be 0 or greater' },
                pattern: {
                  value: /^\d*\.?\d{0,2}$/,
                  message: 'Enter a valid number',
                },
              }}
              render={({ field }) => (
                <Input
                  id='volumetricRate'
                  placeholder='0.00'
                  value={field.value.toString()}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9.]/g, '');
                    field.onChange(parseFloat(cleaned) || 0);
                  }}
                  keyboardType='numeric'
                  size='$4'
                  borderColor={errors.volumetricRate ? '$red8' : undefined}
                />
              )}
            />
            {errors.volumetricRate && (
              <Text color='$red10' fontSize='$2'>
                {errors.volumetricRate.message}
              </Text>
            )}
          </YStack>

          <YStack space='$2'>
            <Label htmlFor='estimatedDays'>
              <XStack space='$2' alignItems='center'>
                <FiClock size={16} />
                <Text>Estimated Delivery Days</Text>
              </XStack>
            </Label>
            <Controller
              control={control}
              name='estimatedDays'
              rules={{
                required: 'Estimated days is required',
                min: { value: 1, message: 'Must be at least 1 day' },
              }}
              render={({ field }) => (
                <Input
                  id='estimatedDays'
                  placeholder='1'
                  value={field.value.toString()}
                  onChangeText={(text) => field.onChange(parseInt(text) || 1)}
                  keyboardType='numeric'
                  size='$4'
                  borderColor={errors.estimatedDays ? '$red8' : undefined}
                />
              )}
            />
            {errors.estimatedDays && (
              <Text color='$red10' fontSize='$2'>
                {errors.estimatedDays.message}
              </Text>
            )}
          </YStack>

          <Button
            size='$3'
            backgroundColor='$primary'
            icon={isLoading ? <Spinner /> : <FaSave />}
            onPress={handleSubmit(onSubmit)}
            marginTop='$2'
          >
            {isEditing ? 'Update Delivery Zone' : 'Create Delivery Zone'}
          </Button>
        </YStack>
      </ScrollView>
    </YStack>
  );
};

export default DeliveryZoneForm;
