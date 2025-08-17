'use client';
import Addnewproduct from '@/components/admin/management/Addnewproduct';
import { ServiceErrorManager } from '@/helpers/service';
import {
  EditProductDetailsService,
  ProductDetailsService,
} from '@/services/products';
import { Product } from '@/types/products';
import React, { FC, use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { getPreviousMediaFiles, getRealFiles } from '@/helpers/utils';
import useFileUpload from '@/components/appComponets/fileupload/useFileUpload';
import { startCase } from 'lodash-es';

interface ProductManagePageProps {
  params: Promise<{ productId: string }>;
  searchParams: { theme?: string };
}

const ProductManage: FC<ProductManagePageProps> = ({ params }) => {
  const router = useRouter();
  const { getFileUpload } = useFileUpload();
  const [isLoading, setIsLoading] = useState(true);
  const form = useForm<Product>();
  const unwrappedParams = use(params);

  const fetchProductDetails = async () => {
    if (!unwrappedParams?.productId) return;
    setIsLoading(true);
    const [err, response] = await ServiceErrorManager(
      ProductDetailsService({
        data: {
          query: {
            _id: unwrappedParams?.productId,
          },
        },
      }),
      {
        failureMessage: 'Error while fetching product details!',
      }
    );
    if (err || !response) return;

    form.reset({
      ...response,
      category: {
        _id: response?.category?._id,
        value: response?.category?._id,
        label: startCase(response?.category.title),
      },
      subCategory: {
        _id: response?.subCategory?._id,
        value: response?.subCategory?._id,
        label: startCase(response?.subCategory?.title),
      },
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const onEdit = async (data: Product) => {
    if (!unwrappedParams?.productId) return;

    const { thumbnail, variants, ...restField } = data;

    const updatedVariants = await Promise.all(
      variants.map(async (variant) => ({
        ...variant,
        media: [
          ...(getRealFiles(variant.media).length > 0
            ? await getFileUpload(getRealFiles(variant.media))
            : []),
          ...getPreviousMediaFiles(variant.media),
        ],
      }))
    );

    const newThumbnailImage = getRealFiles([thumbnail]);
    let uploadedThumbnailImage: any[] = [];

    if (newThumbnailImage.length > 0) {
      uploadedThumbnailImage = await getFileUpload(newThumbnailImage);
    }

    await ServiceErrorManager(
      EditProductDetailsService({
        data: {
          query: { _id: unwrappedParams?.productId },
          payload: {
            ...restField,
            variants: updatedVariants,
            thumbnail: uploadedThumbnailImage[0] || thumbnail,
          },
        },
      }),
      {
        successMessage: 'Your product has been updated successfully!',
      }
    );

    router.back();
  };

  return (
    <Addnewproduct form={form} onSubmit={onEdit} isEdit loading={isLoading} />
  );
};

export default ProductManage;
