'use client';

import { ServiceErrorManager } from '@/helpers/service';
import { useDarkMode } from '@/hook/useDarkMode';
import { ProductByCategoryService } from '@/services/categories';
import { toLower } from 'lodash-es';
import { useRouter } from 'next/navigation';
import { FC, use, useEffect } from 'react';

export interface ListSubCategoryAndCategoryByProductProps {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ category?: string; subCategory?: string }>;
}

const ProductByCategory: FC<ListSubCategoryAndCategoryByProductProps> = ({
  params,
  searchParams,
}) => {
  const idDark = useDarkMode();
  const router = useRouter();
  const unwrappedParams = use(params);
  const unwrappedSearchParams = use(searchParams);
  console.log(unwrappedSearchParams);

  const fetchCategoryByProduct = async () => {
    const [_, data] = await ServiceErrorManager(
      ProductByCategoryService(unwrappedParams.categoryId)({
        params: {
          subCategory: unwrappedSearchParams.subCategory || undefined,
        },
      }),
      {}
    );
  };

  useEffect(() => {
    fetchCategoryByProduct().catch(console.log);
  }, [unwrappedSearchParams]);

  if (unwrappedSearchParams.subCategory) {
    return <div></div>;
  }
  return (
    <div>
      <button
        onClick={() => {
          router.push(
            `${unwrappedParams.categoryId}?category=${toLower(
              unwrappedSearchParams.category
            )}&subCategory=${'67dc90623f2f68ceaedfdac6'}`
          );
        }}
      >
        {' '}
        Move
      </button>
    </div>
  );
};

export default ProductByCategory;
