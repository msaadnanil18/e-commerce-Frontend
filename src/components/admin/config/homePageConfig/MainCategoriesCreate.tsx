import FileUpload from '@/components/appComponets/fileupload/FileUpload';
import AsyncSelect from '@/components/appComponets/select/AsyncSelect';
import { ServiceErrorManager } from '@/helpers/service';
import { ListService } from '@/services/crud';
import { startCase } from 'lodash-es';
import { FC, memo, useCallback } from 'react';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';
import { FiArrowDown, FiArrowUp, FiPlus, FiTrash2 } from 'react-icons/fi';
import {
  Button,
  Input,
  Label,
  SizableText,
  Text,
  XStack,
  YStack,
} from 'tamagui';
import CreateProductCategory from '../../management/Addnewproduct/CreateProductCategory';
import { HomePageConfigFormProps } from './HomePageConfigForm';

const MainCategoriesCreate: FC<{
  form: UseFormReturn<HomePageConfigFormProps>;
}> = ({ form }) => {
  const {
    control,
    formState: { errors },
    setValue,
  } = form;

  const mainCategoriesArray = useFieldArray({
    control,
    name: 'categoryDisplay.mainCategories',
  });

  const moveItem = (
    fieldArray: any,
    index: number,
    direction: 'up' | 'down'
  ) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === fieldArray.fields.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    fieldArray.swap(index, newIndex);

    fieldArray.fields.forEach((item: any, idx: number) => {
      setValue(`${fieldArray.name}.${idx}.position` as any, idx + 1);
    });
  };

  const getProductCategory = useCallback(
    async (search: string, type: string) => {
      const [_, data] = await ServiceErrorManager(
        ListService({
          data: {
            schema: 'Productcategory',
            options: {
              limit: 50,
            },
            query: {
              type,
              ...(search ? { search } : {}),
              searchFields: ['title'],
            },
          },
        }),
        {
          failureMessage: 'Error while getting product category list',
        }
      );
      return (data.docs || []).map((category: any) => ({
        label: startCase(category?.title),
        value: category?._id,
      }));
    },
    []
  );

  return (
    <YStack space='$4'>
      <Label>Main Categories</Label>
      <YStack space='$4'>
        {mainCategoriesArray.fields.map((field, index) => (
          <YStack space='$3' key={index}>
            <XStack
              space='$2'
              justifyContent='space-between'
              alignItems='center'
            >
              <SizableText>Main Category #{index + 1}</SizableText>
              <XStack space='$2'>
                <Button
                  icon={<FiArrowUp />}
                  onPress={() => moveItem(mainCategoriesArray, index, 'up')}
                  disabled={index === 0}
                  size='$2'
                />
                <Button
                  icon={<FiArrowDown />}
                  onPress={() => moveItem(mainCategoriesArray, index, 'down')}
                  disabled={index === mainCategoriesArray.fields.length - 1}
                  size='$2'
                />
                <Button
                  icon={<FiTrash2 />}
                  onPress={() => mainCategoriesArray.remove(index)}
                  size='$2'
                />
              </XStack>
            </XStack>

            <Controller
              control={control}
              name={`categoryDisplay.mainCategories.${index}.position`}
              render={({ field }) => (
                <Input {...field} value={field.value.toString()} />
              )}
            />

            <YStack space='$2'>
              <Label
                htmlFor={`categoryDisplay.mainCategories.${index}.category`}
              >
                Category
              </Label>
              <Controller
                control={control}
                name={`categoryDisplay.mainCategories.${index}.category`}
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <AsyncSelect
                    menuChildren={({ reload }) => (
                      <CreateProductCategory reload={reload} type='category' />
                    )}
                    searchable={true}
                    loadOptions={(searchQuery) =>
                      getProductCategory(searchQuery, 'category')
                    }
                    isAsync={true}
                    {...field}
                  />
                )}
              />
              {errors.categoryDisplay?.mainCategories?.[index]?.category && (
                <Text color='$red10'>
                  {
                    errors.categoryDisplay.mainCategories[index]?.category
                      ?.message
                  }
                </Text>
              )}
            </YStack>

            <YStack space='$2'>
              <Label
                htmlFor={`categoryDisplay.mainCategories.${index}.customName`}
              >
                Custom Name (Optional)
              </Label>
              <Controller
                control={control}
                name={`categoryDisplay.mainCategories.${index}.customName`}
                render={({ field }) => (
                  <Input
                    id={`categoryDisplay.mainCategories.${index}.customName`}
                    placeholder='Custom display name'
                    {...field}
                  />
                )}
              />
            </YStack>

            <YStack space='$2'>
              <Label
                htmlFor={`categoryDisplay.mainCategories.${index}.customImage`}
              >
                Custom Image (Optional)
              </Label>
              <FileUpload
                form={form}
                className='w-full max-w-md mx-auto '
                multiple={false}
                accept={['.jpg', '.jpeg', '.png']}
                name={`bannerProducts.${index}.bannerThumbnail`}
              />
            </YStack>
          </YStack>
        ))}
        <Button
          icon={<FiPlus />}
          onPress={() =>
            mainCategoriesArray.append({
              category: '',
              position: mainCategoriesArray.fields.length + 1,
              customName: '',
              customThumbnail: '',
            })
          }
        >
          Add Main Category
        </Button>
      </YStack>
    </YStack>
  );
};

export default memo(MainCategoriesCreate);
