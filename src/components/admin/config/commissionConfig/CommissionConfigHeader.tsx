'use client';

import AsyncSelect from '@/components/appComponets/select/AsyncSelect';
import { ServiceErrorManager } from '@/helpers/service';
import { useScreen } from '@/hook/useScreen';
import { ListCategoriesService } from '@/services/categories';
import { startCase } from 'lodash-es';
import { Dispatch, FC, memo, SetStateAction, useCallback } from 'react';
import { FaChevronDown, FaChevronUp, FaFilter } from 'react-icons/fa';
import { Button, ScrollView, Text, XStack } from 'tamagui';

const CommissionConfigHeader: FC<{
  sortField: string;
  setSortField: Dispatch<SetStateAction<string>>;
  setSortOrder: Dispatch<SetStateAction<'asc' | 'desc'>>;
  sortOrder: 'asc' | 'desc';
  handelOnCategoryFilter: (category: string) => void;
  setOpenFilterSheet: Dispatch<SetStateAction<boolean>>;
  filterActive: boolean | null;
  filterType: string | null;
  categoryFilter: string;
}> = ({
  sortField,
  setSortField,
  setSortOrder,
  sortOrder,
  handelOnCategoryFilter,
  setOpenFilterSheet,
  filterActive,
  filterType,
  categoryFilter,
}) => {
  const screen = useScreen();
  const renderSortButton = (field: string, label: string) => {
    const isActive = sortField === field;

    return (
      <Button
        size='$3'
        variant='outlined'
        onPress={() => {
          if (isActive) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          } else {
            setSortField(field);
            setSortOrder('asc');
          }
        }}
        borderColor={isActive ? '$blue8' : undefined}
        color={isActive ? '$blue10' : '$gray11'}
        iconAfter={
          isActive ? (
            sortOrder === 'asc' ? (
              <FaChevronUp size={12} />
            ) : (
              <FaChevronDown size={12} />
            )
          ) : undefined
        }
        paddingHorizontal='$2'
        paddingVertical='$1'
        {...{
          '@sm': {
            size: '$2.5',
            paddingHorizontal: '$2.5',
            fontSize: '$2.5',
          },
          '@md': {
            size: '$4',
            fontSize: '$4',
          },
        }}
      >
        {label}
      </Button>
    );
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
    <XStack
      padding='$4'
      space='$2'
      alignItems='center'
      flexWrap='wrap'
      gap='$2'
    >
      <XStack
        flex={1}
        minWidth={200}
        maxWidth={400}
        marginRight='$2'
        position='relative'
      >
        <AsyncSelect
          allowCancel
          value={categoryFilter}
          size='$3'
          placeholder='Search by category...'
          marginBottom={0}
          searchable={true}
          loadOptions={(searchQuery) =>
            getProductCategory(searchQuery, 'category')
          }
          isAsync={true}
          onChange={handelOnCategoryFilter}
        />
      </XStack>

      <XStack space='$2' alignItems='center' gap='$2'>
        <Button
          icon={<FaFilter />}
          onPress={() => setOpenFilterSheet(true)}
          variant='outlined'
          size='$3'
          {...{
            '@sm': {
              size: '$2.5',
              paddingHorizontal: '$2.5',
              fontSize: '$2.5',
            },
            '@md': {
              size: '$4',
              fontSize: '$4',
            },
          }}
        >
          Filters
          {(filterActive !== null || filterType !== null) && (
            <Text color='white' fontSize='$1'>
              {(filterActive !== null ? 1 : 0) + (filterType !== null ? 1 : 0)}
            </Text>
          )}
        </Button>

        <XStack
          alignItems='center'
          backgroundColor='$gray2'
          paddingHorizontal='$2'
          paddingVertical='$1'
          borderRadius='$4'
          space='$2'
          flexWrap='wrap'
          gap='$2'
        >
          <Text color='$gray11' fontSize='$3'>
            Sort:
          </Text>
          <ScrollView
            space='$3'
            horizontal
            {...(screen.xs
              ? {
                  maxWidth: 200,
                }
              : {})}
          >
            {renderSortButton('category', 'Category')}
            {renderSortButton('commissionType', 'Type')}
            {renderSortButton('value', 'Value')}
            {renderSortButton('minOrderAmount', 'Min Order')}
          </ScrollView>
        </XStack>
      </XStack>
    </XStack>
  );
};

export default memo(CommissionConfigHeader);
