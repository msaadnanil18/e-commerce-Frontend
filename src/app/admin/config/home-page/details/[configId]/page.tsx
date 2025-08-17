'use client';

import { ServiceErrorManager } from '@/helpers/service';
import { GetHomePageConfigService } from '@/services/homePageConfig';
import { IHomePageConfig } from '@/types/HomePageConfig';
import { FC, use, useEffect, useState } from 'react';
import {
  YStack,
  XStack,
  Card,
  H1,
  H2,
  H3,
  Text,
  Button,
  Input,
  Switch,
  ScrollView,
  Separator,
  Sheet,
  Tabs,
  Label,
  Circle,
  Square,
  H4,
} from 'tamagui';

import {
  AiOutlineHome as Home,
  AiOutlineSetting as Settings,
  AiOutlineStar as Star,
  AiOutlinePicture as Image,
  AiOutlineAppstore as Grid,
  AiOutlinePlus as Plus,
  AiOutlineEdit as Edit3,
  AiOutlineDelete as Trash2,
  AiOutlineSave as Save,
  AiOutlineEye as Eye,
  AiOutlineEyeInvisible as EyeOff,
  AiOutlineDrag as Move,
  AiOutlineGift as Package,
  AiOutlineTag as Tag,
  AiOutlineLayout as Layout,
  AiOutlineArrowUp as ArrowUp,
  AiOutlineArrowDown as ArrowDown,
  AiOutlineCheck as Check,
  AiOutlineClose as X,
  AiOutlineUpload as Upload,
  AiOutlineSearch as Search,
  AiOutlineFilter as Filter,
  AiOutlineMore as MoreHorizontal,
  AiOutlineClockCircle as Clock,
  AiOutlineUser as User,
  AiOutlineCalendar as Calendar,
} from 'react-icons/ai';
import { IProduct } from '@/types/products';
import { Tag as TmgTag } from '@/components/appComponets/tag/Tag';
import PriceFormatter from '@/components/appComponets/PriceFormatter/PriceFormatter';

interface HomePageConfigDetailsProps {
  params: Promise<{ configId: string }>;
}

const HomePageConfigDetails: FC<HomePageConfigDetailsProps> = ({ params }) => {
  const unwrappedParams = use(params);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [configDetails, setConfigDetails] = useState<IHomePageConfig | null>(
    null
  );

  const fetchConfigDetails = async () => {
    const populate = [
      {
        path: 'featuredProducts',
        populate: 'category',
      },
      {
        path: 'bannerProducts',
        populate: 'product',
      },
      {
        path: 'categoryDisplay.mainCategories.category',
        populate: 'category',
      },
      {
        path: 'categoryDisplay.featuredCategories.category',
        populate: 'category',
      },
    ];

    const [err, data] = await ServiceErrorManager(
      GetHomePageConfigService(unwrappedParams.configId)({
        params: { populate: JSON.stringify(populate) },
      }),
      {}
    );
    if (err) return;
    setConfigDetails(data as IHomePageConfig);
  };

  useEffect(() => {
    fetchConfigDetails().catch(console.log);
  }, []);

  const ProductCard = ({
    product,
    isSelected,
    onSelect,
    showBadge = false,
  }: any) => (
    <Card
      pressStyle={{ scale: 0.95 }}
      animation='bouncy'
      bordered
      elevate
      padding='$3'
      margin='$2'
      minWidth={150}
      backgroundColor={isSelected ? '$blue2' : '$background'}
      borderColor={isSelected ? '$blue8' : '$borderColor'}
      onPress={onSelect}
      cursor='pointer'
    >
      <YStack alignItems='center' space='$2'>
        <Square size={80} backgroundColor='$gray3' borderRadius='$4'>
          <Package size={24} color='$gray10' />
        </Square>
        <Text
          fontSize='$3'
          fontWeight='600'
          textAlign='center'
          numberOfLines={2}
        >
          {product.name}
        </Text>
        <Text fontSize='$2' color='$green10' fontWeight='700'>
          ${product.price}
        </Text>
        {showBadge && isSelected && <Check size={12} />}
      </YStack>
    </Card>
  );

  const CategoryCard = ({
    category,
    config: categoryConfig,
    onEdit,
    onRemove,
    canMove = false,
  }: any) => (
    <Card
      bordered
      elevate
      padding='$4'
      margin='$2'
      backgroundColor='$background'
      animation='bouncy'
      pressStyle={{ scale: 0.98 }}
    >
      <XStack alignItems='center' space='$3'>
        {canMove && (
          <YStack space='$1'>
            <Button size='$2' circular icon={ArrowUp} />
            <Button size='$2' circular icon={ArrowDown} />
          </YStack>
        )}

        <Circle size={60} backgroundColor='$gray3'>
          <Grid size={20} color='$gray10' />
        </Circle>

        <YStack flex={1} space='$1'>
          <XStack alignItems='center' space='$2'>
            <Text fontSize='$4' fontWeight='600'>
              {categoryConfig?.customName || category.name}
            </Text>
            {categoryConfig?.position && <>#{categoryConfig.position}</>}
          </XStack>

          {categoryConfig?.highlightText && (
            <Text fontSize='$2' color='$gray11'>
              {categoryConfig.highlightText}
            </Text>
          )}

          {categoryConfig?.badgeText && categoryConfig.badgeText}
        </YStack>

        <XStack space='$2'>
          <Button size='$3' circular icon={Edit3} onPress={onEdit} />
          <Button size='$3' circular icon={Trash2} onPress={onRemove} />
        </XStack>
      </XStack>
    </Card>
  );

  return (
    <ScrollView flex={1} scrollbarWidth='thin'>
      <YStack padding='$4' space='$4'>
        {/* Header */}
        <Card bordered elevate padding='$4' backgroundColor='$background'>
          <XStack alignItems='center' justifyContent='space-between'>
            <XStack alignItems='center' space='$3'>
              <Circle size={50} backgroundColor='$blue8'>
                <Home size={24} color='white' />
              </Circle>
              <YStack>
                <H4 color='$color12'>Homepage Configuration</H4>
                <Text color='$gray11'>
                  Manage your homepage layout and content
                </Text>
              </YStack>
            </XStack>

            <XStack space='$3'>
              <XStack alignItems='center' space='$2'>
                <Text fontSize='$3'>Active:</Text>
                <Switch
                  checked={configDetails?.isActive}
                  //   onCheckedChange={(checked) =>
                  //     handleConfigUpdate('isActive', checked)
                  //   }
                  size='$4'
                >
                  <Switch.Thumb animation='bouncy' />
                </Switch>
              </XStack>
              <Button icon={Save} size='$4'>
                Save Changes
              </Button>
            </XStack>
          </XStack>
        </Card>

        {/* Status Bar */}
        <Card bordered padding='$3' backgroundColor='$background'>
          <XStack alignItems='center' justifyContent='space-between'>
            <XStack alignItems='center' space='$4'>
              <XStack alignItems='center' space='$2'>
                <Circle
                  size={8}
                  backgroundColor={
                    configDetails?.isActive ? '$green8' : '$red8'
                  }
                />
                <Text fontSize='$3' fontWeight='600'>
                  {configDetails?.isActive ? 'Active' : 'Inactive'}
                </Text>
              </XStack>

              <Separator vertical height={20} />

              <XStack alignItems='center' space='$2'>
                <Package size={16} color='$gray11' />
                <Text fontSize='$3' color='$gray11'>
                  {configDetails?.featuredProducts.length} Featured Products
                </Text>
              </XStack>

              <XStack alignItems='center' space='$2'>
                <Image size={16} color='$gray11' />
                <Text fontSize='$3' color='$gray11'>
                  {configDetails?.bannerProducts?.length} Banner Items
                </Text>
              </XStack>
            </XStack>

            <XStack alignItems='center' space='$2'>
              <Clock size={16} color='$gray11' />
              <Text fontSize='$2' color='$gray11'>
                Last modified: 2 hours ago
              </Text>
            </XStack>
          </XStack>
        </Card>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          defaultValue='details'
          orientation='horizontal'
          flex={1}
          flexDirection='column'
        >
          <Tabs.List backgroundColor='$background' padding='$1'>
            <Tabs.Trigger value='overview' flex={1}>
              <XStack alignItems='center' space='$2'>
                <Layout size={16} />
                <Text>Overview</Text>
              </XStack>
            </Tabs.Trigger>
            <Tabs.Trigger value='products' flex={1}>
              <XStack alignItems='center' space='$2'>
                <Package size={16} />
                <Text>Products</Text>
              </XStack>
            </Tabs.Trigger>
            <Tabs.Trigger value='categories' flex={1}>
              <XStack alignItems='center' space='$2'>
                <Grid size={16} />
                <Text>Categories</Text>
              </XStack>
            </Tabs.Trigger>
            <Tabs.Trigger value='settings' flex={1}>
              <XStack alignItems='center' space='$2'>
                <Settings size={16} />
                <Text>Settings</Text>
              </XStack>
            </Tabs.Trigger>
          </Tabs.List>

          {/* Overview Tab */}
          <Tabs.Content value='overview'>
            <YStack space='$4'>
              <Card bordered elevate padding='$4' backgroundColor='$background'>
                <H2 size='$6' marginBottom='$3'>
                  Configuration Overview
                </H2>

                <YStack space='$3'>
                  <XStack
                    alignItems='center'
                    justifyContent='space-between'
                    padding='$3'
                    backgroundColor='$gray2'
                    borderRadius='$4'
                  >
                    <XStack alignItems='center' space='$3'>
                      <Tag size={20} color='$blue10' />
                      <YStack>
                        <Text fontSize='$4' fontWeight='600'>
                          Configuration Name
                        </Text>
                        <Text fontSize='$3' color='$gray11'>
                          {configDetails?.name}
                        </Text>
                      </YStack>
                    </XStack>
                    <Button icon={Edit3} size='$3' />
                  </XStack>

                  <XStack space='$3'>
                    <Card
                      flex={1}
                      padding='$4'
                      backgroundColor='$blue2'
                      borderColor='$blue8'
                    >
                      <YStack alignItems='center' space='$2'>
                        <Star size={24} color='$blue10' />
                        <Text fontSize='$6' fontWeight='700' color='$blue11'>
                          {configDetails?.featuredProducts?.length}
                        </Text>
                        <Text fontSize='$3' color='$blue11'>
                          Featured Products
                        </Text>
                      </YStack>
                    </Card>

                    <Card
                      flex={1}
                      padding='$4'
                      backgroundColor='$green2'
                      borderColor='$green8'
                    >
                      <YStack alignItems='center' space='$2'>
                        <Image size={24} color='$green10' />
                        <Text fontSize='$6' fontWeight='700' color='$green11'>
                          {configDetails?.bannerProducts?.length}
                        </Text>
                        <Text fontSize='$3' color='$green11'>
                          Banner Products
                        </Text>
                      </YStack>
                    </Card>

                    <Card
                      flex={1}
                      padding='$4'
                      backgroundColor='$purple2'
                      borderColor='$purple8'
                    >
                      <YStack alignItems='center' space='$2'>
                        <Grid size={24} color='$purple10' />
                        <Text fontSize='$6' fontWeight='700' color='$purple11'>
                          {(configDetails?.categoryDisplay?.mainCategories
                            ?.length || 0) +
                            (configDetails?.categoryDisplay?.featuredCategories
                              ?.length || 0)}
                        </Text>
                        <Text fontSize='$3' color='$purple11'>
                          Total Categories
                        </Text>
                      </YStack>
                    </Card>
                  </XStack>
                </YStack>
              </Card>

              {/* Quick Actions */}
              <Card bordered elevate padding='$4' backgroundColor='$background'>
                <H3 size='$5' marginBottom='$3'>
                  Quick Actions
                </H3>
                <XStack space='$3' flexWrap='wrap'>
                  <Button
                    icon={Plus}
                    onPress={() => setShowProductSelector(true)}
                  >
                    Add Featured Product
                  </Button>
                  <Button icon={Image}>Manage Banners</Button>
                  <Button
                    icon={Grid}
                    onPress={() => setShowCategorySelector(true)}
                  >
                    Configure Categories
                  </Button>
                  <Button icon={Eye}>Preview Homepage</Button>
                </XStack>
              </Card>
            </YStack>
          </Tabs.Content>

          {/* Products Tab */}
          <Tabs.Content value='products'>
            <YStack space='$4'>
              {/* Featured Products */}
              <Card bordered elevate padding='$4' backgroundColor='$background'>
                <XStack
                  alignItems='center'
                  justifyContent='space-between'
                  marginBottom='$3'
                >
                  <H3 size='$5'>Featured Products</H3>
                  <Button
                    size='$3'
                    icon={Plus}
                    onPress={() => setShowProductSelector(true)}
                  >
                    Add Product
                  </Button>
                </XStack>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <XStack space='$3' padding='$2'>
                    {configDetails?.featuredProducts
                      ?.filter(
                        (item): item is IProduct => typeof item !== 'string'
                      )
                      .map((product, index) => {
                        return product ? (
                          <ProductCard
                            key={index}
                            product={product}
                            isSelected={true}
                            showBadge={true}
                            onSelect={() => {
                              const newFeatured =
                                configDetails.featuredProducts.filter(
                                  (pro) =>
                                    typeof pro !== 'string' &&
                                    pro._id !== product._id
                                );
                              //handleConfigUpdate('featuredProducts', newFeatured);
                            }}
                          />
                        ) : null;
                      })}
                    {configDetails?.featuredProducts.length === 0 && (
                      <Card
                        padding='$4'
                        minWidth={200}
                        backgroundColor='$gray2'
                        borderStyle='dashed'
                      >
                        <YStack alignItems='center' space='$2'>
                          <Plus size={24} color='$gray10' />
                          <Text color='$gray11'>No featured products</Text>
                          <Button
                            size='$3'
                            onPress={() => setShowProductSelector(true)}
                          >
                            Add First Product
                          </Button>
                        </YStack>
                      </Card>
                    )}
                  </XStack>
                </ScrollView>
              </Card>

              {/* Banner Products */}
              <Card bordered elevate padding='$4' backgroundColor='$background'>
                <XStack
                  alignItems='center'
                  justifyContent='space-between'
                  marginBottom='$3'
                >
                  <H3 size='$5'>Banner Products</H3>
                  <Button size='$3' icon={Plus}>
                    Add Banner
                  </Button>
                </XStack>

                <YStack space='$3'>
                  {(configDetails?.bannerProducts || [])?.map(
                    (banner, index) => {
                      return banner.product ? (
                        <Card
                          key={index}
                          bordered
                          padding='$3'
                          backgroundColor='$gray1'
                        >
                          <XStack alignItems='center' space='$3'>
                            <TmgTag
                              backgroundColor='$blue8'
                              //color='white'
                              //size='sm'
                            >
                              #{banner.displayOrder}
                            </TmgTag>

                            <Square
                              size={60}
                              backgroundColor='$gray3'
                              borderRadius='$3'
                            >
                              <Package size={20} color='$gray10' />
                            </Square>

                            <YStack flex={1}>
                              <Text fontSize='$4' fontWeight='600'>
                                {banner?.product?.name}
                              </Text>
                              <Text fontSize='$3' color='$gray11'>
                                <PriceFormatter
                                  value={banner?.product?.variants[0]?.price}
                                />
                              </Text>
                            </YStack>

                            <XStack space='$2'>
                              <Button size='$3' circular icon={Upload} />
                              <Button size='$3' circular icon={Edit3} />
                              <Button
                                size='$3'
                                circular
                                icon={Trash2}

                                //  onPress={() => removeBannerProduct(index)}
                              />
                            </XStack>
                          </XStack>
                        </Card>
                      ) : null;
                    }
                  )}
                </YStack>
              </Card>
            </YStack>
          </Tabs.Content>

          {/* Categories Tab */}
          <Tabs.Content value='categories'>
            <YStack space='$4'>
              {/* Main Categories */}
              <Card bordered elevate padding='$4' backgroundColor='$background'>
                <XStack
                  alignItems='center'
                  justifyContent='space-between'
                  marginBottom='$3'
                >
                  <H3 size='$5'>Main Categories</H3>
                  <Button size='$3' icon={Plus}>
                    Add Category
                  </Button>
                </XStack>

                <YStack space='$2'>
                  {configDetails?.categoryDisplay?.mainCategories.map(
                    (mainCat, index) => {
                      return mainCat.category ? (
                        <CategoryCard
                          key={index}
                          category={mainCat.category}
                          config={mainCat}
                          canMove={true}
                          onEdit={() => {}}
                          onRemove={() => {
                            const newMainCategories =
                              configDetails?.categoryDisplay.mainCategories.filter(
                                (_, i) => i !== index
                              );
                            // handleNestedUpdate(
                            //   'categoryDisplay.mainCategories',
                            //   newMainCategories
                            // );
                          }}
                        />
                      ) : null;
                    }
                  )}
                </YStack>
              </Card>

              {/* Featured Categories */}
              <Card bordered elevate padding='$4' backgroundColor='$background'>
                <XStack
                  alignItems='center'
                  justifyContent='space-between'
                  marginBottom='$3'
                >
                  <H3 size='$5'>Featured Categories</H3>
                  <Button size='$3' icon={Plus}>
                    Add Featured
                  </Button>
                </XStack>

                <YStack space='$2'>
                  {configDetails?.categoryDisplay.featuredCategories.map(
                    (featCat, index) => {
                      return featCat.category ? (
                        <CategoryCard
                          key={index}
                          category={featCat.category}
                          config={featCat}
                          canMove={true}
                          onEdit={() => {}}
                          onRemove={() => {
                            const newFeaturedCategories =
                              configDetails?.categoryDisplay.featuredCategories.filter(
                                (_, i) => i !== index
                              );
                            // handleNestedUpdate(
                            //   'categoryDisplay.featuredCategories',
                            //   newFeaturedCategories
                            // );
                          }}
                        />
                      ) : null;
                    }
                  )}
                </YStack>
              </Card>
            </YStack>
          </Tabs.Content>

          {/* Settings Tab */}
          <Tabs.Content value='settings'>
            <Card bordered elevate padding='$4' backgroundColor='$background'>
              <H3 size='$5' marginBottom='$4'>
                Configuration Settings
              </H3>

              <YStack space='$4'>
                <YStack space='$2'>
                  <Label fontSize='$3' fontWeight='600'>
                    Configuration Name
                  </Label>
                  <Input
                    value={configDetails?.name}
                    // onChangeText={(text) => handleConfigUpdate('name', text)}
                    placeholder='Enter configuration name'
                    size='$4'
                  />
                </YStack>

                <XStack
                  alignItems='center'
                  justifyContent='space-between'
                  padding='$3'
                  backgroundColor='$gray2'
                  borderRadius='$4'
                >
                  <YStack>
                    <Text fontSize='$4' fontWeight='600'>
                      Active Status
                    </Text>
                    <Text fontSize='$3' color='$gray11'>
                      {configDetails?.isActive
                        ? 'This configuration is currently live'
                        : 'This configuration is inactive'}
                    </Text>
                  </YStack>
                  <Switch
                    checked={configDetails?.isActive}
                    // onCheckedChange={(checked) =>
                    //   handleConfigUpdate('isActive', checked)
                    // }
                    size='$4'
                  >
                    <Switch.Thumb animation='bouncy' />
                  </Switch>
                </XStack>

                <Separator />

                <YStack space='$3'>
                  <Text fontSize='$4' fontWeight='600'>
                    Danger Zone
                  </Text>
                  <XStack space='$3'>
                    <Button variant='outlined' icon={Trash2}>
                      Delete Configuration
                    </Button>
                    <Button variant='outlined'>Reset to Default</Button>
                  </XStack>
                </YStack>
              </YStack>
            </Card>
          </Tabs.Content>
        </Tabs>

        {/* Product Selector Sheet */}
        <Sheet
          modal
          open={showProductSelector}
          onOpenChange={setShowProductSelector}
          snapPoints={[85]}
          dismissOnSnapToBottom
        >
          <Sheet.Overlay />
          <Sheet.Handle />
          <Sheet.Frame padding='$4' backgroundColor='$background'>
            <YStack space='$4' height='100%'>
              <XStack alignItems='center' justifyContent='space-between'>
                <H3 size='$5'>Select Products</H3>
                <Button
                  size='$3'
                  circular
                  icon={X}
                  onPress={() => setShowProductSelector(false)}
                />
              </XStack>

              <XStack space='$3' alignItems='center'>
                <Input
                  flex={1}
                  placeholder='Search products...'
                  //   value={searchTerm}
                  //   onChangeText={setSearchTerm}
                  size='$4'
                />
                <Button icon={Search} size='$4' />
                <Button icon={Filter} size='$4' variant='outlined' />
              </XStack>

              <ScrollView flex={1}>
                {/* <XStack flexWrap='wrap' padding='$2'>
                  {mockProducts
                    .filter((product) =>
                      product.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        isSelected={config.featuredProducts.includes(
                          product._id
                        )}
                        onSelect={() => {
                          const isSelected = config.featuredProducts.includes(
                            product._id
                          );
                          if (isSelected) {
                            const newFeatured = config.featuredProducts.filter(
                              (id) => id !== product._id
                            );
                            handleConfigUpdate('featuredProducts', newFeatured);
                          } else {
                            handleConfigUpdate('featuredProducts', [
                              ...config.featuredProducts,
                              product._id,
                            ]);
                          }
                        }}
                        showBadge={true}
                      />
                    ))}
                </XStack> */}
              </ScrollView>

              <XStack justifyContent='flex-end' space='$3'>
                <Button
                  variant='outlined'
                  onPress={() => setShowProductSelector(false)}
                >
                  Cancel
                </Button>
                <Button onPress={() => setShowProductSelector(false)}>
                  Done
                </Button>
              </XStack>
            </YStack>
          </Sheet.Frame>
        </Sheet>
      </YStack>
    </ScrollView>
  );
};

export default HomePageConfigDetails;
