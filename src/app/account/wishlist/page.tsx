import Wishlist from '@/components/customers/wishList/WishlistHeader';
import { EcommarceName } from '@/helpers/utils';

export async function generateMetadata() {
  return {
    title: `My Wishlist | ${EcommarceName()}`,
    description: `Wishlist Online Store in India. Check Wishlist Prices, Ratings & Reviews at ${EcommarceName()}`,
  };
}

const MYWishlistPage = () => {
  return <Wishlist />;
};

export default MYWishlistPage;
