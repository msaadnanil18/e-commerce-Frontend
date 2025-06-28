import AsyncSelect from '@/components/appComponets/select/AsyncSelect';
import { ServiceErrorManager } from '@/helpers/service';
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
import { ListCategoriesService } from '@/services/categories';

const FeaturedCategory: FC<{
  form: UseFormReturn<HomePageConfigFormProps>;
}> = ({ form }) => {
  const {
    control,
    formState: { errors },
    setValue,
  } = form;

  const featuredCategoriesArray = useFieldArray({
    control,
    name: 'categoryDisplay.featuredCategories',
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
        ListCategoriesService(1, 50, search, type, true)(),
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
      <Label>Featured Categories</Label>
      <YStack space='$4'>
        {featuredCategoriesArray.fields.map((field, index) => (
          <YStack space='$3' key={index}>
            <XStack
              space='$2'
              justifyContent='space-between'
              alignItems='center'
            >
              <SizableText>Featured Category #{index + 1}</SizableText>
              <XStack space='$2'>
                <Button
                  icon={<FiArrowUp />}
                  onPress={() => moveItem(featuredCategoriesArray, index, 'up')}
                  disabled={index === 0}
                  size='$2'
                />
                <Button
                  icon={<FiArrowDown />}
                  onPress={() =>
                    moveItem(featuredCategoriesArray, index, 'down')
                  }
                  disabled={index === featuredCategoriesArray.fields.length - 1}
                  size='$2'
                />
                <Button
                  icon={<FiTrash2 />}
                  onPress={() => featuredCategoriesArray.remove(index)}
                  size='$2'
                />
              </XStack>
            </XStack>

            <Controller
              control={control}
              name={`categoryDisplay.featuredCategories.${index}.position`}
              render={({ field }) => (
                <Input {...field} value={field.value.toString()} />
              )}
            />

            <YStack space='$2'>
              <Label
                htmlFor={`categoryDisplay.featuredCategories.${index}.category`}
              >
                Category
              </Label>
              <Controller
                control={control}
                name={`categoryDisplay.featuredCategories.${index}.category`}
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <AsyncSelect
                    // menuChildren={({ reload }) => (
                    //   <CreateProductCategory reload={reload} type='category' />
                    // )}
                    searchable={true}
                    loadOptions={(searchQuery) =>
                      getProductCategory(searchQuery, 'category')
                    }
                    isAsync={true}
                    {...field}
                  />
                )}
              />
              {errors.categoryDisplay?.featuredCategories?.[index]
                ?.category && (
                <Text color='$red10'>
                  {
                    errors.categoryDisplay.featuredCategories[index]?.category
                      ?.message
                  }
                </Text>
              )}
            </YStack>

            <YStack space='$2'>
              <Label
                htmlFor={`categoryDisplay.featuredCategories.${index}.highlightText`}
              >
                Highlight Text (Optional)
              </Label>
              <Controller
                control={control}
                name={`categoryDisplay.featuredCategories.${index}.highlightText`}
                render={({ field }) => (
                  <Input
                    id={`categoryDisplay.featuredCategories.${index}.highlightText`}
                    placeholder='Highlight text'
                    {...field}
                  />
                )}
              />
            </YStack>

            <YStack space='$2'>
              <Label
                htmlFor={`categoryDisplay.featuredCategories.${index}.badgeText`}
              >
                Badge Text (Optional)
              </Label>
              <Controller
                control={control}
                name={`categoryDisplay.featuredCategories.${index}.badgeText`}
                render={({ field }) => (
                  <Input
                    id={`categoryDisplay.featuredCategories.${index}.badgeText`}
                    placeholder='Badge text'
                    {...field}
                  />
                )}
              />
            </YStack>
          </YStack>
        ))}
        <Button
          icon={<FiPlus />}
          onPress={() =>
            featuredCategoriesArray.append({
              category: '',
              position: featuredCategoriesArray.fields.length + 1,
              highlightText: '',
              badgeText: '',
            })
          }
        >
          Add Featured Category
        </Button>
      </YStack>
    </YStack>
  );
};
export default memo(FeaturedCategory);
