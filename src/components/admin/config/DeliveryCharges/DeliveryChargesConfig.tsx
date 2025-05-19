'use client';
import Pagination from '@/components/appComponets/Pagination';
import { Tag } from '@/components/appComponets/tag/Tag';
import { ServiceErrorManager } from '@/helpers/service';
import { usePagination } from '@/hook/usePagination';
import { useScreen } from '@/hook/useScreen';
import { ListDeliveryZoneService } from '@/services/delivery';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { FiBox, FiClock, FiMapPin, FiPackage } from 'react-icons/fi';
import { RiEdit2Fill } from 'react-icons/ri';
import {
  Button,
  Card,
  H6,
  Input,
  Paragraph,
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
} from 'tamagui';
import Loader from '../../organism/Loader';

interface DeliveryZone {
  _id?: string;
  name: string;
  regions: string[];
  baseCharge: number;
  weightRate: number;
  volumetricRate: number;
  estimatedDays: number;
}

const DeliveryChargesConfig = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const media = useScreen();

  const fetchDeliveryZoneList = useCallback(
    async (page: number, limit: number, search: string) => {
      const [err, data] = await ServiceErrorManager(
        ListDeliveryZoneService({
          data: {
            options: {
              page,
              limit,
            },
            query: {
              search,
            },
          },
        }),
        { failureMessage: 'Error while fetching Delivery Zone List' }
      );
      if (err || !data) return;
      return data;
    },
    []
  );

  const {
    state: { loading, items: deliveryZones },
    action,
    paginationProps,
  } = usePagination<DeliveryZone>({
    fetchFunction: fetchDeliveryZoneList,
  });

  const isMobile = media.xs;
  const isTablet = media.md;

  return (
    <YStack paddingHorizontal={isMobile ? '$2' : '$4'}>
      <XStack padding={'$4'} />
      <XStack
        padding={isMobile ? '$2' : '$4'}
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent='space-between'
        space={isMobile ? '$3' : undefined}
      >
        <H6 fontWeight='bold'>Delivery Zones</H6>
        <XStack
          flexWrap='wrap'
          gap='$3'
          flexDirection={isMobile ? 'column' : 'row'}
          width={isMobile ? '100%' : undefined}
        >
          <XStack
            flex={isMobile ? undefined : 1}
            width={isMobile ? '100%' : undefined}
            minWidth={isMobile ? undefined : 200}
            maxWidth={isMobile ? '100%' : 300}
          >
            <Input
              flex={1}
              size='$3'
              placeholder='Search...'
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                action.handleOnSearch(text, 600);
              }}
              paddingLeft='$8'
              width={isMobile ? '100%' : undefined}
            />
            <XStack
              position='absolute'
              left='$2'
              top='25%'
              pointerEvents='none'
            >
              <FaSearch size={16} color='#94a3b8' />
            </XStack>
          </XStack>
          <Button
            onPress={() => router.push('/admin/config/delivery-zone/create')}
            icon={<FaPlus />}
            color='$text'
            size='$3'
            fontSize='$3'
            marginRight={isMobile ? undefined : '$2'}
            backgroundColor='$primary'
            hoverStyle={{ backgroundColor: '$primaryHover' }}
            width={isMobile ? '100%' : undefined}
          >
            Set Delivery Zone
          </Button>
        </XStack>
      </XStack>

      {loading ? (
        <Loader />
      ) : (
        <ScrollView>
          <YStack space='$2'>
            {deliveryZones.length === 0 ? (
              <Card padding='$4'>
                <Paragraph textAlign='center'>
                  No delivery zones found. Create your first zone!
                </Paragraph>
              </Card>
            ) : (
              deliveryZones.map((zone) => (
                <Card key={zone._id} padding={isMobile ? '$3' : '$4'} bordered>
                  <XStack
                    justifyContent='space-between'
                    alignItems={isMobile ? 'flex-start' : 'center'}
                    flexDirection={isMobile ? 'column' : 'row'}
                    space={isMobile ? '$2' : undefined}
                  >
                    <YStack width={isMobile ? '100%' : undefined}>
                      <Text fontSize='$5' fontWeight='bold'>
                        {zone.name}
                      </Text>
                      <XStack
                        flexWrap='wrap'
                        space='$2'
                        alignItems='center'
                        marginTop='$1'
                      >
                        <XStack space='$1' alignItems='center'>
                          <FiMapPin size={14} />
                          <Text fontSize='$3'>
                            {zone.regions.length} regions
                          </Text>
                        </XStack>
                        <XStack flexWrap='wrap' gap='$1'>
                          {zone.regions.map((region) => (
                            <View key={region} marginBottom='$1'>
                              <Tag
                                style={{ borderRadius: 2, height: 20 }}
                                textProps={{
                                  fontSize: '$3',
                                  textTransform: 'uppercase',
                                  borderRadius: 0,
                                }}
                              >
                                {region}
                              </Tag>
                            </View>
                          ))}
                        </XStack>
                      </XStack>
                    </YStack>

                    <Button
                      size='$3'
                      onPress={() =>
                        router.push(
                          `/admin/config/delivery-zone/update/${zone._id}`
                        )
                      }
                      icon={<RiEdit2Fill size={16} />}
                      alignSelf={isMobile ? 'flex-end' : undefined}
                    />
                  </XStack>

                  <XStack
                    marginTop='$3'
                    gap='$3'
                    flexWrap='wrap'
                    justifyContent={isMobile ? 'space-between' : undefined}
                  >
                    <XStack
                      space='$1'
                      alignItems='center'
                      minWidth={
                        isMobile ? (isTablet ? '45%' : '48%') : undefined
                      }
                      marginBottom={isMobile ? '$2' : undefined}
                    >
                      <Text fontSize='$3'>₹ Base: {zone.baseCharge}</Text>
                    </XStack>

                    <XStack
                      space='$1'
                      alignItems='center'
                      minWidth={
                        isMobile ? (isTablet ? '45%' : '48%') : undefined
                      }
                      marginBottom={isMobile ? '$2' : undefined}
                    >
                      <FiPackage size={14} />
                      <Text fontSize='$3'>Weight: {zone.weightRate}/kg</Text>
                    </XStack>

                    <XStack
                      space='$1'
                      alignItems='center'
                      minWidth={
                        isMobile ? (isTablet ? '45%' : '48%') : undefined
                      }
                      marginBottom={isMobile ? '$2' : undefined}
                    >
                      <FiBox size={14} />
                      <Text fontSize='$3'>
                        Volume: {zone.volumetricRate}/m³
                      </Text>
                    </XStack>

                    <XStack
                      space='$1'
                      alignItems='center'
                      minWidth={
                        isMobile ? (isTablet ? '45%' : '48%') : undefined
                      }
                      marginBottom={isMobile ? '$2' : undefined}
                    >
                      <FiClock size={14} />
                      <Text fontSize='$3'>
                        {zone.estimatedDays} day
                        {zone.estimatedDays !== 1 ? 's' : ''}
                      </Text>
                    </XStack>
                  </XStack>
                </Card>
              ))
            )}
          </YStack>
        </ScrollView>
      )}
      <Pagination {...paginationProps} />
      <XStack padding='$2' />
    </YStack>
  );
};

export default DeliveryChargesConfig;
