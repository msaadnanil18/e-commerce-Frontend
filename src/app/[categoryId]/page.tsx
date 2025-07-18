import Navbar from '@/components/navbar';
import ProductByCategory, {
  ListSubCategoryAndCategoryByProductProps,
} from '@/components/ProductByCategory';
import { EcommarceName } from '@/helpers/utils';
import { startCase } from 'lodash-es';
import { FC } from 'react';

export async function generateMetadata({
  searchParams,
}: ListSubCategoryAndCategoryByProductProps) {
  const _searchParams = await searchParams;
  const e_comm = EcommarceName();
  return {
    title: `${startCase(_searchParams.category)} | ${e_comm}`,
    description: `${startCase(_searchParams.category)} | ${e_comm}`,
  };
}

const ListSubCategoryAndCategoryByProduct: FC<
  ListSubCategoryAndCategoryByProductProps
> = (props) => {
  return (
    <div>
      <Navbar />
      <ProductByCategory {...props} />
    </div>
  );
};

export default ListSubCategoryAndCategoryByProduct;
