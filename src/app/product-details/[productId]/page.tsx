import React, { FC } from 'react';
import ProductDetails from '@/components/itemDetails';
import { ResolvingMetadata } from 'next';

interface ProductDetailsPageProps {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ name?: string; description?: string }>;
}

export async function generateMetadata(
  { searchParams }: ProductDetailsPageProps,
  parent: ResolvingMetadata
) {
  const _searchParams = await searchParams;
  return {
    title: _searchParams.name,
    description: _searchParams.description,
  };
}

const ProductPage: FC<ProductDetailsPageProps> = (props) => {
  return <ProductDetails {...props} />;
};

export default ProductPage;
