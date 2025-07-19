import Service from '@/helpers/service';

export const AddProductToCartService = Service('/cart/add-to-cart');

export const GetCartPageDetailsService = Service('/cart/page/get', {
  method: 'GET',
});

export const RemoveProductFormCartServie = Service('/cart/product-remove');

export const ProductCartQuantityAddRemove = Service(
  '/cart/quantity/add-remove'
);
