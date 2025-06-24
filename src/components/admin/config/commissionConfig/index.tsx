'use client';

import PriceFormatter from '@/components/appComponets/PriceFormatter/PriceFormatter';
import { ServiceErrorManager } from '@/helpers/service';
import { ListCommissionConfigService } from '@/services/Commission';
import { ICommissionConfig } from '@/types/Commission';
import { head, startCase } from 'lodash-es';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useState } from 'react';
import {
  FaPlus,
  FaPercentage,
  FaLayerGroup,
  FaSync,
  FaTag,
} from 'react-icons/fa';
import { RiEdit2Fill } from 'react-icons/ri';
import {
  Button,
  XStack,
  YStack,
  Text,
  Card,
  Paragraph,
  Separator,
  ScrollView,
  Spinner,
  Tooltip,
  Avatar,
  H6,
} from 'tamagui';
import CommissionFilters from './CommissionFilters';
import CommissionConfigHeader from './CommissionConfigHeader';
import { usePagination } from '@/hook/usePagination';
import Pagination from '@/components/appComponets/Pagination';

const Commission: FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<string>('category');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [openFilterSheet, setOpenFilterSheet] = useState(false);
  const router = useRouter();

  const fetchCommissionConfigList = useCallback(
    async (
      page: number,
      limit: number,
      search: string,
      categoryFilter: string
    ) => {
      const [err, data] = await ServiceErrorManager(
        ListCommissionConfigService({
          data: {
            schema: 'CommissionConfig',
            options: {
              limit,
              page,
              ...(sortField
                ? {
                    sort: {
                      [sortField]: sortOrder === 'asc' ? 1 : -1,
                    },
                  }
                : {}),
            },
            query: {
              ...(categoryFilter ? { category: categoryFilter } : {}),
              ...(search ? { search: search } : {}),
              ...(filterActive !== null
                ? { 'conditions.isActive': filterActive }
                : {}),
              ...(filterType ? { commissionType: filterType } : {}),
            },
          },
        }),
        {
          failureMessage: 'Error while getting commission config list',
        }
      );

      if (err || !data) return;
      return data;
    },
    [filterActive, filterType, sortField, sortOrder]
  );

  const {
    state: { loading, items: commissionConfig },
    action,
    paginationProps,
  } = usePagination<ICommissionConfig>({
    fetchFunction: fetchCommissionConfigList,
  });

  const handelOnCategoryFilter = async (r: string) => {
    console.log(r, 'ihiluhed');
    setCategoryFilter(r);
    await action.fetchData('', r);
  };

  const resetFilters = async () => {
    setCategoryFilter('');
    setSortOrder('asc');
    setSortField('category');
    setFilterActive(null);
    setFilterType(null);
    setOpenFilterSheet(false);
    await action.refresh();
  };

  const editConfig = (config: ICommissionConfig) => {
    router.push(`/admin/config/commission/update/${config._id}`);
  };

  const getCommissionTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <FaPercentage size={16} color='#0ea5e9' />;
      case 'fixed':
        return null;
      case 'tiered':
        return <FaLayerGroup size={16} color='#8b5cf6' />;
      default:
        return <FaPercentage size={16} color='#0ea5e9' />;
    }
  };

  const getCommissionValue = (config: ICommissionConfig) => {
    if (config.commissionType === 'tiered') {
      return `${config.tiers?.length || 0} tier${
        config.tiers?.length !== 1 ? 's' : ''
      }`;
    } else if (config.commissionType === 'percentage') {
      return `${config.value}%`;
    } else {
      return <PriceFormatter value={config.value || 0} />;
    }
  };

  return (
    <YStack>
      <XStack padding='$3' />
      <YStack padding='$1' paddingBottom='$3' space='$4'>
        <Card padding='$3'>
          <XStack
            justifyContent='space-between'
            alignItems='center'
            flexWrap='wrap'
            gap='$2'
          >
            <H6 color='$gray12'>Commission Configurations</H6>
            <XStack space='$2' alignItems='center'>
              <Button
                onPress={() => action.refresh()}
                icon={loading ? <Spinner /> : <FaSync size={14} />}
                variant='outlined'
                size='$3'
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button
                backgroundColor='$primary'
                onPress={() => {
                  router.push('/admin/config/commission/create');
                }}
                icon={<FaPlus size={14} />}
                size='$3'
              >
                New Configuration
              </Button>
            </XStack>
          </XStack>
        </Card>

        <Card bordered>
          <YStack>
            <CommissionConfigHeader
              {...{
                sortField,
                setSortField,
                setSortOrder,
                sortOrder,
                handelOnCategoryFilter,
                setOpenFilterSheet,
                filterActive,
                filterType,
                categoryFilter,
              }}
            />

            <Separator />

            {loading ? (
              <XStack padding='$8' justifyContent='center' alignItems='center'>
                <Spinner size='large' color='$blue10' />
              </XStack>
            ) : commissionConfig.length === 0 ? (
              <YStack
                padding='$8'
                justifyContent='center'
                alignItems='center'
                space='$4'
              >
                <Text color='$gray10' fontSize='$5'>
                  No commission configurations found
                </Text>
                <Paragraph color='$gray9' textAlign='center'>
                  {categoryFilter || filterActive !== null || filterType
                    ? 'Try adjusting your search or filters'
                    : 'Create your first commission configuration to get started'}
                </Paragraph>
                {(categoryFilter || filterActive !== null || filterType) && (
                  <Button onPress={resetFilters} icon={<FaSync size={14} />}>
                    Reset Filters
                  </Button>
                )}
              </YStack>
            ) : (
              <ScrollView>
                <YStack padding='$2' space='$3'>
                  {commissionConfig.map((config) => {
                    const category = startCase(config?.category?.title);

                    return (
                      <Card
                        key={config._id}
                        bordered
                        animation='bouncy'
                        scale={0.97}
                        hoverStyle={{ scale: 1 }}
                        pressStyle={{ scale: 0.96 }}
                      >
                        <XStack
                          padding='$4'
                          alignItems='center'
                          flexWrap='wrap'
                          gap='$4'
                        >
                          <Tooltip placement='top'>
                            <Tooltip.Trigger>
                              <Avatar
                                circular
                                size='$3'
                                backgroundColor='$blue5'
                              >
                                <Text color='$blue11' fontSize='$4'>
                                  {head(startCase(config.createdBy.name))}
                                </Text>
                              </Avatar>
                            </Tooltip.Trigger>
                            <Tooltip.Content
                              enterStyle={{
                                x: 0,
                                y: -5,
                                opacity: 0,
                                scale: 0.9,
                              }}
                              exitStyle={{
                                x: 0,
                                y: -5,
                                opacity: 0,
                                scale: 0.9,
                              }}
                              scale={1}
                              x={0}
                              y={0}
                              opacity={1}
                              paddingVertical='$2'
                            >
                              <Tooltip.Arrow />
                              <Text fontSize='$3' lineHeight='$1'>
                                {config.createdBy.name}
                              </Text>
                            </Tooltip.Content>
                          </Tooltip>

                          <YStack flex={1} minWidth={200} space='$1'>
                            <XStack alignItems='center' space='$2'>
                              <Text
                                fontSize='$5'
                                fontWeight='bold'
                                color='$gray12'
                              >
                                {category}
                              </Text>

                              <Text
                                fontSize='$1'
                                color={
                                  config.conditions?.isActive
                                    ? '$green11'
                                    : '$gray11'
                                }
                              >
                                {config.conditions?.isActive
                                  ? 'Active'
                                  : 'Inactive'}
                              </Text>
                            </XStack>

                            <XStack space='$4' flexWrap='wrap' gap='$2'>
                              <XStack alignItems='center' space='$1'>
                                <Tooltip>
                                  {getCommissionTypeIcon(config.commissionType)}
                                </Tooltip>
                                <Text fontSize='$3' color='$gray11'>
                                  {getCommissionValue(config)}
                                </Text>
                              </XStack>

                              <XStack alignItems='center' space='$1'>
                                <Text fontSize='$3' color='$gray11'>
                                  Min Order:{' '}
                                  <PriceFormatter
                                    value={config.minOrderAmount}
                                  />
                                </Text>
                              </XStack>

                              {config.conditions?.appliesToOnSaleItems && (
                                <XStack alignItems='center' space='$1'>
                                  <FaTag size={14} color='#f59e0b' />
                                  <Text fontSize='$3' color='$gray11'>
                                    On-Sale Items
                                  </Text>
                                </XStack>
                              )}

                              {config.conditions?.appliesToClearance && (
                                <XStack alignItems='center' space='$1'>
                                  <FaTag size={14} color='#ef4444' />
                                  <Text fontSize='$3' color='$gray11'>
                                    Clearance Items
                                  </Text>
                                </XStack>
                              )}
                            </XStack>
                          </YStack>

                          <XStack space='$2' alignSelf='center'>
                            <Tooltip>
                              <Button
                                size='$3'
                                onPress={() => editConfig(config)}
                                icon={<RiEdit2Fill size={16} />}
                              />
                            </Tooltip>
                          </XStack>
                        </XStack>
                      </Card>
                    );
                  })}
                </YStack>
              </ScrollView>
            )}
          </YStack>
        </Card>
      </YStack>
      <Pagination {...paginationProps} />
      <XStack padding='$2' />
      <CommissionFilters
        {...{
          openFilterSheet,
          setOpenFilterSheet,
          setFilterActive,
          setFilterType,
          filterType,
          filterActive,
          resetFilters,
        }}
      />
    </YStack>
  );
};

export default Commission;
