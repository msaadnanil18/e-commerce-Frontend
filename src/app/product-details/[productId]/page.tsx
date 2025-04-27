'use client';
import React, { FC, useEffect, useState } from 'react';
import ItemDetails from '@/components/itemDetails';
import { ServiceErrorManager } from '@/helpers/service';
import { AnonymousProductDetailsService } from '@/services/products';
import { IProduct } from '@/types/products';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store/store';

interface ProductDetailsPageProps {
  params: { productId: string };
  searchParams: { theme?: string };
}

const ProductDetails: FC<ProductDetailsPageProps> = ({ params }) => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    user: { user },
  } = useSelector((state: RootState) => state);

  const fetchProductDetails = async () => {
    if (!params.productId) return;
    setIsLoading(true);
    const [_, response] = await ServiceErrorManager(
      AnonymousProductDetailsService({
        data: {
          payload: { user: user?._id },
          query: { _id: params.productId },
        },
      }),
      {}
    );
    setProduct(response);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchProductDetails().catch(console.log);
  }, []);
  return <ItemDetails {...{ product, isLoading, setProduct }} />;
};

export default ProductDetails;
