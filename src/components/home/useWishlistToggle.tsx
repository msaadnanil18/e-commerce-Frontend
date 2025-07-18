import { useRouter, usePathname } from 'next/navigation';

import { ServiceErrorManager } from '@/helpers/service';
import { AddProductToWishlistService } from '@/services/wishList';
import { IProduct } from '@/types/products';
import { useState } from 'react';
import { useHomePageContextContext } from './HomePageContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store/store';

export const useWishlistToggle = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setHomeScreenData } = useHomePageContextContext();
  const user = useSelector((state: RootState) => state.user);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const toggleWishlist = async (productId: string) => {
    if (!user.isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }

    setWishlistLoading(true);
    const [_, { data }] = await ServiceErrorManager(
      AddProductToWishlistService({
        data: {
          payload: {
            product: productId,
          },
        },
      }),
      {}
    );

    setHomeScreenData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        featuredProducts: prev.featuredProducts
          .filter(
            (pro): pro is IProduct => typeof pro === 'object' && pro !== null
          )
          .map((pro) => ({
            ...pro,
            isInWishList: data.products?.includes(pro._id),
          })),
      };
    });

    setWishlistLoading(false);
  };

  return {
    toggleWishlist,
    wishlistLoading,
  };
};
