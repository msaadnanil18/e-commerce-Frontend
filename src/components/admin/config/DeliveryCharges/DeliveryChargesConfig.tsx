'use client';
import { ServiceErrorManager } from '@/helpers/service';
import { ListDeliveryZoneService } from '@/services/delivery';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FiBox, FiClock, FiMapPin, FiPackage } from 'react-icons/fi';
import { RiEdit2Fill } from 'react-icons/ri';
import {
  YStack,
  XStack,
  Button,
  Card,
  Text,
  Paragraph,
  ScrollView,
  View,
  H6,
} from 'tamagui';
import Loader from '../../organism/Loader';
import { Tag } from '@/components/appComponets/tag/Tag';

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
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const fetchDeliveryZoneList = () => {
    setLoading(true);
    ServiceErrorManager(ListDeliveryZoneService(), {})
      .then(([_, response]) => {
        setDeliveryZones(response.docs || []);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDeliveryZoneList();
  }, []);
  return (
    <YStack>
      <XStack padding='$4' justifyContent='space-between'>
        <H6 fontWeight='bold'>Delivery Zones</H6>
        <Button
          onPress={() => router.push('/admin/config/delivery-zone/create')}
          icon={<FaPlus />}
          color='$text'
          size='$3'
          fontSize='$3'
          marginRight='$2'
          backgroundColor='$primary'
          hoverStyle={{ backgroundColor: '$primaryHover' }}
        >
          Set Delivery Zone
        </Button>
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
                <Card key={zone._id} padding='$4' bordered>
                  <XStack justifyContent='space-between' alignItems='center'>
                    <YStack>
                      <Text fontSize='$5' fontWeight='bold'>
                        {zone.name}
                      </Text>
                      <XStack space='$2' alignItems='center' marginTop='$1'>
                        <FiMapPin size={14} />
                        <Text fontSize='$3'>{zone.regions.length} regions</Text>
                        {zone.regions.map((region) => (
                          <View key={region} style={{ marginRight: 12 }}>
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
                    </YStack>

                    <XStack space='$2'>
                      <Button
                        size='$3'
                        onPress={() =>
                          router.push(
                            `/admin/config/delivery-zone/update/${zone._id}`
                          )
                        }
                        icon={<RiEdit2Fill size={16} />}
                      />
                    </XStack>
                  </XStack>

                  <XStack marginTop='$3' space='$4' flexWrap='wrap'>
                    <XStack space='$1' alignItems='center'>
                      ₹ <Text fontSize='$3'>Base: {zone.baseCharge}</Text>
                    </XStack>

                    <XStack space='$1' alignItems='center'>
                      <FiPackage size={14} />
                      <Text fontSize='$3'>Weight: {zone.weightRate}/kg</Text>
                    </XStack>

                    <XStack space='$1' alignItems='center'>
                      <FiBox size={14} />
                      <Text fontSize='$3'>
                        Volume: {zone.volumetricRate}/m³
                      </Text>
                    </XStack>

                    <XStack space='$1' alignItems='center'>
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
    </YStack>
  );
};

export default DeliveryChargesConfig;
