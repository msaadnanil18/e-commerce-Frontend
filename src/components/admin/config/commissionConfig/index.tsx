// 'use client';

// import { ServiceErrorManager } from '@/helpers/service';
// import { ListCommissionConfigService } from '@/services/Commission';
// import { ICommissionConfig } from '@/types/Commission';
// import { useRouter } from 'next/navigation';
// import { FC, useEffect, useState } from 'react';
// import { FaPlus } from 'react-icons/fa';
// import { Button, XStack, YStack } from 'tamagui';

// const Commission: FC = () => {
//   const [commissionConfig, setCommissionConfig] = useState<
//     Array<ICommissionConfig>
//   >([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const router = useRouter();

//   const fetchCommissionConfigList = () => {
//     setLoading(true);
//     ServiceErrorManager(ListCommissionConfigService(), {})
//       .then(([_, data]) => {
//         setCommissionConfig(data.docs);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   useEffect(() => {
//     fetchCommissionConfigList();
//   }, []);
//   return (
//     <YStack>
//       <XStack padding='$4' justifyContent='flex-end'>
//         <Button
//           onPress={() => {
//             router.push('/admin/config/commission/create');
//           }}
//           icon={<FaPlus />}
//           color='$text'
//           size='$3'
//           fontSize='$3'
//           marginRight='$2'
//           backgroundColor='$primary'
//           hoverStyle={{ backgroundColor: '$primaryHover' }}
//         >
//           Set Commission Config
//         </Button>
//       </XStack>
//     </YStack>
//   );
// };

// export default Commission;

'use client';

import TmgDrawer from '@/components/appComponets/Drawer/TmgDrawer';
import PriceFormatter from '@/components/appComponets/PriceFormatter/PriceFormatter';
import { ServiceErrorManager } from '@/helpers/service';
import { ListCommissionConfigService } from '@/services/Commission';
import { ICommissionConfig } from '@/types/Commission';
import { head, startCase } from 'lodash-es';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaPercentage,
  FaLayerGroup,
  FaCheckCircle,
  FaTimesCircle,
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
  Input,
  ScrollView,
  Spinner,
  Tooltip,
  Avatar,
  H6,
} from 'tamagui';

const Commission: FC = () => {
  const [commissionConfig, setCommissionConfig] = useState<
    Array<ICommissionConfig>
  >([]);
  const [filteredConfig, setFilteredConfig] = useState<
    Array<ICommissionConfig>
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<string>('category');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [openFilterSheet, setOpenFilterSheet] = useState(false);
  const [selectedConfig, setSelectedConfig] =
    useState<ICommissionConfig | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  const fetchCommissionConfigList = () => {
    setLoading(true);
    ServiceErrorManager(ListCommissionConfigService(), {})
      .then(([_, data]) => {
        setCommissionConfig(data.docs);
        setFilteredConfig(data.docs);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCommissionConfigList();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [
    searchQuery,
    sortOrder,
    sortField,
    filterActive,
    filterType,
    commissionConfig,
  ]);

  const applyFiltersAndSort = () => {
    let filtered = [...commissionConfig];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((config) => {
        // Get category name from mock data (replace with actual logic)
        const category = config.category.title || '';
        return category.toLowerCase().includes(query);
      });
    }

    // Apply active filter
    if (filterActive !== null) {
      filtered = filtered.filter(
        (config) => config.conditions?.isActive === filterActive
      );
    }

    // Apply commission type filter
    if (filterType) {
      filtered = filtered.filter(
        (config) => config.commissionType === filterType
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case 'category':
          aValue = a.category.title || '';
          bValue = a.category.title || '';
          break;
        case 'commissionType':
          aValue = a.commissionType;
          bValue = b.commissionType;
          break;
        case 'value':
          aValue = a.value || 0;
          bValue = b.value || 0;
          break;
        case 'minOrderAmount':
          aValue = a.minOrderAmount;
          bValue = b.minOrderAmount;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredConfig(filtered);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSortOrder('asc');
    setSortField('category');
    setFilterActive(null);
    setFilterType(null);
    setOpenFilterSheet(false);
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
      >
        {label}
      </Button>
    );
  };

  return (
    <YStack>
      <YStack padding='$2' space='$4'>
        <Card padding='$4'>
          <XStack
            justifyContent='space-between'
            alignItems='center'
            flexWrap='wrap'
            gap='$2'
          >
            <H6 color='$gray12'>Commission Configurations</H6>
            <XStack space='$2' alignItems='center'>
              <Button
                onPress={() => fetchCommissionConfigList()}
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
            {/* Search and filter bar */}
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
                position='relative'
              >
                <Input
                  flex={1}
                  size='$3'
                  placeholder='Search by category...'
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  paddingLeft='$8'
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

              <XStack space='$2' alignItems='center' flexWrap='wrap' gap='$2'>
                <Button
                  icon={<FaFilter size={14} />}
                  onPress={() => setOpenFilterSheet(true)}
                  variant='outlined'
                  size='$3'
                >
                  Filters
                  {(filterActive !== null || filterType !== null) && (
                    <Text color='white' fontSize='$1'>
                      {(filterActive !== null ? 1 : 0) +
                        (filterType !== null ? 1 : 0)}
                    </Text>
                  )}
                </Button>

                <XStack
                  alignItems='center'
                  backgroundColor='$gray2'
                  paddingHorizontal='$2'
                  paddingVertical='$1'
                  borderRadius='$4'
                  space='$1'
                >
                  <Text color='$gray11' fontSize='$3'>
                    Sort:
                  </Text>
                  {renderSortButton('category', 'Category')}
                  {renderSortButton('commissionType', 'Type')}
                  {renderSortButton('value', 'Value')}
                  {renderSortButton('minOrderAmount', 'Min Order')}
                </XStack>
              </XStack>
            </XStack>

            <Separator />

            {/* Commission Config List */}
            {loading ? (
              <XStack padding='$8' justifyContent='center' alignItems='center'>
                <Spinner size='large' color='$blue10' />
              </XStack>
            ) : filteredConfig.length === 0 ? (
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
                  {searchQuery || filterActive !== null || filterType
                    ? 'Try adjusting your search or filters'
                    : 'Create your first commission configuration to get started'}
                </Paragraph>
                {(searchQuery || filterActive !== null || filterType) && (
                  <Button onPress={resetFilters} icon={<FaSync size={14} />}>
                    Reset Filters
                  </Button>
                )}
              </YStack>
            ) : (
              <ScrollView>
                <YStack padding='$2' space='$3'>
                  {filteredConfig.map((config) => {
                    const category = startCase(config.category.title);

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
                  // variant={filterActive === true ? "filled" : "outlined"}
                  // theme={filterActive === true ? "green" : "gray"}
                  onPress={() =>
                    setFilterActive(filterActive === true ? null : true)
                  }
                  icon={<FaCheckCircle size={14} />}
                  size='$3'
                >
                  Active
                </Button>
                <Button
                  //  variant={filterActive === false ? "filled" : "outlined"}
                  //  theme={filterActive === false ? "gray" : "gray"}
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
                  //  variant={filterType === 'percentage' ? "filled" : "outlined"}
                  //  theme={filterType === 'percentage' ? "blue" : "gray"}
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
                  //  variant={filterType === 'fixed' ? "filled" : "outlined"}
                  //  theme={filterType === 'fixed' ? "green" : "gray"}
                  onPress={() =>
                    setFilterType(filterType === 'fixed' ? null : 'fixed')
                  }
                  icon={() => <div>₹</div>}
                  size='$3'
                >
                  Fixed
                </Button>
                <Button
                  // variant={filterType === 'tiered' ? 'filled' : 'outlined'}
                  //theme={filterType === 'tiered' ? 'purple' : 'gray'}
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
    </YStack>
  );
};

export default Commission;
