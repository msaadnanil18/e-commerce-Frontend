import Service from '@/helpers/service';

export const AddProductToWishlistService = Service('/wishlist/product/add');

export const WishLists = Service('/wishlist/list');

export const RemoveProductFromWishlist = Service('/wishlist/product/remove');

export const GetWishList = Service('/wishlist/get');
