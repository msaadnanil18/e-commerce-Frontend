'use client';
import { IWishlist } from '@/types/wishList';
import React, { FC } from 'react';
import { FaHeart } from 'react-icons/fa';
import { XStack, Text } from 'tamagui';
import WishlistItem from './WishlistItem';

const WishlistHeader: FC<{ wishList: IWishlist | null }> = ({ wishList }) => {
  return (
    <XStack
      paddingVertical='$4'
      paddingHorizontal='$5'
      alignItems='center'
      space='$4'
      backgroundColor='$backgroundStrong'
      borderBottomWidth={1}
      borderBottomColor='$borderColor'
    >
      <FaHeart size={24} />
      <Text fontSize='$4' fontWeight='bold'>
        My Wishlist
      </Text>
      <Text fontSize='$3.5' color='$gray10' marginLeft='auto'>
        {wishList?.products.length}{' '}
        {wishList?.products.length === 1 ? 'item' : 'items'}
      </Text>
    </XStack>
  );
};

export default WishlistHeader;
