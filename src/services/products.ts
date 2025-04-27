import Service from '@/helpers/service';

export const ProductCreateService = Service('/product/create');

export const ProductListService = Service('/product/list');

export const ProductcategoryCreateService = Service(
  '/product/create/Product-category'
);

export const ProductDetailsService = Service('/product/get');

export const EditProductDetailsService = Service('/product/edit');

export const ProductApprovalandRejectionService = Service(
  '/product/approval-Rejection'
);

export const AnonymousProductDetailsService = Service('/anonymous/product/get');
