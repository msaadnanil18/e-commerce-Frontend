import { useScreen } from '@/hook/useScreen';
import { FC, useState } from 'react';
import {
  Text,
  H6,
  YStack,
  Button,
  XStack,
  Separator,
  Input,
  ScrollView,
} from 'tamagui';

interface FilterProps {
  filters: {
    status: string;
    dateFrom: Date | null;
    dateTo: Date | null;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      status: string;
      dateFrom: Date | null;
      dateTo: Date | null;
    }>
  >;
  onClose?: () => void;
}

const FilterContent: FC<FilterProps> = ({ filters, setFilters, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const screen = useScreen();

  return (
    <ScrollView
      flex={1}
      maxHeight='calc(100vh - 74px)'
      maxWidth={300}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <YStack marginLeft='$7' padding={screen.sm ? '$2' : '$3'} space='$2'>
        <H6>Filter Orders</H6>
        <YStack space='$1.5' marginTop='$1'>
          <Text fontWeight='bold'>Order Status</Text>

          {screen.xs ? (
            <XStack flexWrap='wrap' gap='$1'>
              {[
                'all',
                'pending',
                'accepted',
                'shipped',
                'delivered',
                'canceled',
              ].map((status) => (
                <Button
                  key={status}
                  size={screen.sm ? '$2' : '$3'}
                  margin='$1'
                  backgroundColor={
                    localFilters.status === status ? '$primary' : ''
                  }
                  variant={
                    localFilters.status !== status ? 'outlined' : undefined
                  }
                  onPress={() => setLocalFilters({ ...localFilters, status })}
                >
                  {status === 'all'
                    ? 'All'
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </XStack>
          ) : (
            <YStack space='sm'>
              {[
                'all',
                'pending',
                'accepted',
                'shipped',
                'delivered',
                'canceled',
              ].map((status) => (
                <Button
                  key={status}
                  size='$3'
                  margin='$1'
                  backgroundColor={
                    localFilters.status === status ? '$primary' : ''
                  }
                  variant={
                    localFilters.status !== status ? 'outlined' : undefined
                  }
                  onPress={() => setLocalFilters({ ...localFilters, status })}
                >
                  {status === 'all'
                    ? 'All'
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </YStack>
          )}

          <Separator marginVertical='$1.5' />

          <Text fontWeight='bold'>Date Range</Text>
          <YStack space='$1.5'>
            <Text>From</Text>
            <Input size={screen.sm ? '$2' : '$3'} placeholder='MM/DD/YYYY' />
            <Text marginTop='$1.5'>To</Text>
            <Input size={screen.sm ? '$2' : '$3'} placeholder='MM/DD/YYYY' />
          </YStack>

          <YStack space='$2' marginTop='$2'>
            <Button
              size={screen.sm ? '$2' : '$3'}
              variant='outlined'
              onPress={() =>
                setLocalFilters({
                  status: 'all',
                  dateFrom: null,
                  dateTo: null,
                })
              }
            >
              Reset Filters
            </Button>
            <Button
              size={screen.sm ? '$2' : '$3'}
              backgroundColor='$primary'
              onPress={() => {
                setFilters(localFilters);
                if (onClose) onClose();
              }}
            >
              Apply Filters
            </Button>
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
};

export default FilterContent;
