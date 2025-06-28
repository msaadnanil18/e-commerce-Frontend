import Service from '@/helpers/service';

export const ListCategoriesService = (
  page: number,
  limit: number,
  search?: string,
  type?: string,
  isFeatured?: boolean,
  categoryId?: string
) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (type) params.append('type', type);

  if (isFeatured !== null && isFeatured !== undefined) {
    params.append('isFeatured', String(isFeatured));
  }
  if (categoryId) params.append('categoryId', categoryId);

  return Service(
    `/product/categories/list/${page}/${limit}?${params.toString()}`,
    {
      method: 'GET',
    }
  );
};

export const CreateProductCategoryServie = Service(
  '/product/categories/create'
);

export const RemoveProductCategoryService = (id: string) =>
  Service(`/product/categories/delete/${id}`, { method: 'DELETE' });

export const UpdatateProductCategoryService = (id: string) =>
  Service(`/product/categories/get/${id}`, { method: 'PUT' });
