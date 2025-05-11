'use client';
import TmgDrawer from '@/components/appComponets/Drawer/TmgDrawer';
import React, { Dispatch, FC, SetStateAction } from 'react';
import {
  FaCheckCircle,
  FaLayerGroup,
  FaPercentage,
  FaSync,
  FaTimesCircle,
} from 'react-icons/fa';
import { ScrollView, YStack, Text, XStack, Button } from 'tamagui';

const CommissionFilters: FC<{
  setOpenFilterSheet: Dispatch<SetStateAction<boolean>>;
  openFilterSheet: boolean;
  setFilterType: Dispatch<SetStateAction<string | null>>;
  setFilterActive: Dispatch<SetStateAction<boolean | null>>;
  filterType: string | null;
  filterActive: boolean | null;
  resetFilters: () => void;
}> = ({
  openFilterSheet,
  setOpenFilterSheet,
  setFilterActive,
  setFilterType,
  filterType,
  filterActive,
  resetFilters,
}) => {
  return (
    <TmgDrawer
      open={openFilterSheet}
      onOpenChange={setOpenFilterSheet}
      showCloseButton
      dismissOnSnapToBottom
      title='Filters'
    >
      <ScrollView maxHeight={400}>
        <YStack padding='$3' space='$4'>
          <YStack space='$2'>
            <Text fontWeight='bold' color='$gray11'>
              Status
            </Text>
            <XStack space='$4'>
              <Button
                backgroundColor={filterActive === true ? '$primary' : undefined}
                variant={filterActive === false ? 'outlined' : undefined}
                onPress={() =>
                  setFilterActive(filterActive === true ? null : true)
                }
                icon={<FaCheckCircle size={14} />}
                size='$3'
              >
                Active
              </Button>
              <Button
                backgroundColor={
                  filterActive === false ? '$primary' : undefined
                }
                variant={filterActive === true ? 'outlined' : undefined}
                onPress={() =>
                  setFilterActive(filterActive === false ? null : false)
                }
                icon={<FaTimesCircle size={14} />}
                size='$3'
              >
                Inactive
              </Button>
            </XStack>
          </YStack>

          <YStack space='$2'>
            <Text fontWeight='bold' color='$gray11'>
              Commission Type
            </Text>
            <XStack space='$2' flexWrap='wrap' gap='$2'>
              <Button
                variant={filterType === 'percentage' ? undefined : 'outlined'}
                backgroundColor={
                  filterType === 'percentage' ? '$primary' : undefined
                }
                onPress={() =>
                  setFilterType(
                    filterType === 'percentage' ? null : 'percentage'
                  )
                }
                icon={<FaPercentage size={14} />}
                size='$3'
              >
                Percentage
              </Button>
              <Button
                variant={filterType === 'fixed' ? undefined : 'outlined'}
                backgroundColor={
                  filterType === 'fixed' ? '$primary' : undefined
                }
                onPress={() =>
                  setFilterType(filterType === 'fixed' ? null : 'fixed')
                }
                icon={() => <div>₹</div>}
                size='$3'
              >
                Fixed
              </Button>
              <Button
                variant={filterType === 'tiered' ? undefined : 'outlined'}
                backgroundColor={
                  filterType === 'tiered' ? '$primary' : undefined
                }
                onPress={() =>
                  setFilterType(filterType === 'tiered' ? null : 'tiered')
                }
                icon={<FaLayerGroup size={14} />}
                size='$3'
              >
                Tiered
              </Button>
            </XStack>
          </YStack>

          <XStack paddingTop='$4' space='$2' justifyContent='flex-end'>
            <Button
              size='$3'
              onPress={resetFilters}
              variant='outlined'
              icon={<FaSync size={14} />}
            >
              Reset
            </Button>
            <Button size='$3' onPress={() => setOpenFilterSheet(false)}>
              Apply Filters
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </TmgDrawer>
  );
};

export default CommissionFilters;
