'use client';

import Addnewproduct from '@/components/admin/management/Addnewproduct';
import { Product } from '@/types/products';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { ServiceErrorManager } from '@/helpers/service';
import { ProductCreateService } from '@/services/products';
import useFileUpload from '@/components/appComponets/fileupload/useFileUpload';

const AddProduct: FC = () => {
  const { getFileUpload } = useFileUpload();
  const form = useForm<Product>({
    defaultValues: {
      name: '',
      description: '',
      category: '',
      thumbnail: undefined,
      variants: [
        {
          sku: '',
          variantName: '',
          discount: 0,
          price: 0,
          attributes: [],
          inventory: 0,
          isMadeOnDemand: false,
          shippingTimeline: '',
          media: [],
        },
      ],
      quantityRules: {
        min: 1,
        max: 100,
        step: 0,
        predefined: [],
      },
      sellerSpecificDetails: {
        manufacturer: '',
        packaging: '',
        serviceTerms: '',
        brand: '',
        paymentOptions: {
          immediatePayment: true,
          deferredPayment: false,
        },
      },
      physicalAttributes: {
        weight: 0,
        weightUnit: 'kilogram',
        dimensions: {
          length: 0,
          width: 0,
          height: 0,
          dimensionUnit: 'centimeter',
        },
      },
      hsnCode: '',
      taxType: 'exclusive',
    },
  });

  const onSubmit = async (data: Product) => {
    const { thumbnail, variants, ...restField } = data;
    const thumbnailFile = await getFileUpload([thumbnail]);

    const updateMediaFile = await Promise.all(
      variants.map(async (variant) => ({
        ...variant,
        media: await getFileUpload(variant.media),
      }))
    );
    await ServiceErrorManager(
      ProductCreateService({
        data: {
          payload: {
            ...restField,
            variants: updateMediaFile,
            thumbnail: thumbnailFile[0],
          },
        },
      }),
      {
        failureMessage: 'Error while adding product please try sometimes later',
        successMessage: 'Your product successfully Added',
      }
    );
    form.reset();
  };

  return <Addnewproduct {...{ form, onSubmit }} />;
};

export default AddProduct;
