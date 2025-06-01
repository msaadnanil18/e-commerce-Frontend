import Service from '@/helpers/service';

export const ListCategoriesService = (
  page: number,
  limit: number,
  search?: string,
  type?: string
) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (type) params.append('type', type);

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
