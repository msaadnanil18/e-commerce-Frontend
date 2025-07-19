import Wishlist from '@/components/customers/wishList/WishlistHeader';
import Navbar from '@/components/navbar';
import { EcommarceName } from '@/helpers/utils';

export async function generateMetadata() {
  return {
    title: `My Wishlist | ${EcommarceName()}`,
    description: `Wishlist Online Store in India. Check Wishlist Prices, Ratings & Reviews at ${EcommarceName()}`,
  };
}

const MYWishlistPage = () => {
  return (
    <div className='page-container'>
      <div className='navbar'>
        <Navbar />
      </div>

      <Wishlist />
    </div>
  );
};

export default MYWishlistPage;
