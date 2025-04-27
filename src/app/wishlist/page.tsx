'use client';

import CustomerSideBar from '@/components/customers/CustomerSideBar';
import WishlistHeader from '@/components/customers/wishList/WishlistHeader';
import { ServiceErrorManager } from '@/helpers/service';
import { GetWishList } from '@/services/wishList';
import { IWishlist } from '@/types/wishList';
import { FC, useEffect, useState } from 'react';
import { AnimatePresence, Card, ScrollView, YStack } from 'tamagui';
import WishlistItem from '@/components/customers/wishList/WishlistItem';
import Loader from '@/components/admin/organism/Loader';
import EmptyState from '@/components/appComponets/Empty/EmptyState';
import { FaHeartBroken } from 'react-icons/fa';

const Wishlist: FC = () => {
  const [wishList, setWishList] = useState<IWishlist | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [removeAnimation, setRemoveAnimation] = useState<string | null>(null);

  const fetchWishList = async () => {
    setLoading(true);
    ServiceErrorManager(GetWishList(), {})
      .then(([_, data]) => setWishList(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWishList();
  }, []);

  return (
    <div className='admin-container'>
      <CustomerSideBar />

      <YStack flex={1} backgroundColor='$background'>
        <WishlistHeader wishList={wishList} />
        {loading ? (
          <Loader />
        ) : wishList?.products.length === 0 ? (
          <YStack marginTop='$8'>
            <Card backgroundColor='$cardBackground'>
              <EmptyState
                icon={<FaHeartBroken size={60} />}
                title='  Your wishlist is empty'
                description=' Add items to your wishlist by clicking the heart icon on products you love'
              />
            </Card>
          </YStack>
        ) : (
          <ScrollView padding='$4'>
            <AnimatePresence>
              {wishList?.products.map((product) => (
                <WishlistItem
                  setWishList={setWishList}
                  key={product._id}
                  product={product}
                  removeAnimation={removeAnimation}
                />
              ))}
            </AnimatePresence>
          </ScrollView>
        )}
      </YStack>
    </div>
  );
};

export default Wishlist;
