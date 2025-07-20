'use client';

import { ServiceErrorManager } from '@/helpers/service';
import { ProductByCategoryService } from '@/services/categories';
import { useRouter, usePathname } from 'next/navigation';
import { FC, use, useEffect, useState } from 'react';
import CategorySidebar from './CategorySidebar';
import { IProductCategory } from '@/types/productCategory';
import { XStack, YStack, Text, ScrollView, View, Spinner } from 'tamagui';
import ProductCard from '../home/ProductCard';
import { startCase } from 'lodash-es';
import { IProduct } from '@/types/products';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store/store';
import { AddProductToWishlistService } from '@/services/wishList';
import EmptyState from '../appComponets/Empty/EmptyState';
import { MdInventory2 } from 'react-icons/md';

export interface ListSubCategoryAndCategoryByProductProps {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ category?: string; subCategory?: string }>;
}

const ProductByCategory: FC<ListSubCategoryAndCategoryByProductProps> = ({
  params,
  searchParams,
}) => {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [productByCategory, setProductByCategory] = useState<Array<IProduct>>(
    []
  );

  const [productBySubCategory, setProductBySubCategory] = useState<
    Array<IProductCategory>
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const unwrappedParams = use(params);
  const unwrappedSearchParams = use(searchParams);

  const fetchCategoryByProduct = async () => {
    setLoading(true);
    const [_, data] = await ServiceErrorManager(
      ProductByCategoryService(unwrappedParams.categoryId)({
        params: {
          subCategory: unwrappedSearchParams.subCategory || undefined,
          user: user.user?._id || undefined,
        },
      }),
      {}
    );

    if ((data?.subCategorys || []).length > 0) {
      setProductBySubCategory(data.subCategorys);
    }

    setProductByCategory(data.product || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategoryByProduct().catch(console.log);
  }, [unwrappedSearchParams]);

  const toggleWishlist = async (productId: string) => {
    if (!user.isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }

    setWishlistLoading(true);
    const [_, { data }] = await ServiceErrorManager(
      AddProductToWishlistService({
        data: {
          payload: {
            product: productId,
          },
        },
      }),
      {}
    );

    setProductByCategory((prev) => {
      return prev.map((pro) =>
        pro._id == productId
          ? { ...pro, isInWishList: data.products?.includes(pro._id) }
          : pro
      );
    });

    setWishlistLoading(false);
  };

  return (
    <XStack>
      <CategorySidebar
        subCategorys={productBySubCategory}
        params={unwrappedParams}
        searchParams={unwrappedSearchParams}
      />

      <YStack flex={1} width='100%'>
        <ScrollView
          maxHeight='calc(100vh - 74px)'
          contentContainerStyle={{ paddingBottom: 30 }}
          width='100%'
          scrollbarWidth='thin'
        >
          <YStack padding='$4' width='100%'>
            <Text
              fontSize='$5'
              fontWeight='bold'
              marginLeft='$12'
              marginBottom='$2'
            >
              {startCase(unwrappedSearchParams.category)}
            </Text>
            {loading ? (
              <YStack
                flex={1}
                justifyContent='center'
                alignItems='center'
                padding='$4'
                minHeight='$20'
              >
                <Spinner size='large' color='$blue10' />
                <Text marginTop='$4'>Loading products...</Text>
              </YStack>
            ) : !productByCategory.length ? (
              <EmptyState
                icon={<MdInventory2 size={60} />}
                title='No products available'
                description='There are currently no products in this category. Check back later or browse other categories to discover amazing items.'
              />
            ) : (
              <XStack
                flexWrap='wrap'
                justifyContent='center'
                alignItems='flex-start'
                gap='$3'
                width='100%'
              >
                {productByCategory?.map((item, index) => (
                  <View key={item._id || index} width='100%' maxWidth='300px'>
                    <ProductCard
                      product={item}
                      wishlistLoading={wishlistLoading}
                      toggleWishlist={toggleWishlist}
                      productOnClick={(product) => {
                        router.push(
                          `/product-details/${product._id}?name=${product.name}&description=${product.description}`
                        );
                      }}
                    />
                  </View>
                ))}
              </XStack>
            )}
          </YStack>
        </ScrollView>
      </YStack>
    </XStack>
  );
};

export default ProductByCategory;
