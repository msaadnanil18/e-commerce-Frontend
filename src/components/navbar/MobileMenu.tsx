'use client';
import React from 'react';
import { Button, Text, XStack, YStack } from 'tamagui';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { FiPackage } from 'react-icons/fi';
import { FaHeart, FaUserCircle, FaRegUser } from 'react-icons/fa';
import { LiaGiftsSolid } from 'react-icons/lia';
import { RiShoppingCart2Line } from 'react-icons/ri';
import AsyncSelect from '../appComponets/select/AsyncSelect';
import { startCase } from 'lodash-es';
import ThemeToggle from './ThemeToggle';
import { RootState } from '@/states/store/store';
import useAuth from '../auth/useAuth';

interface Props {
  onRoleChange: (role: string) => void;
  roleChangeLoading: boolean;
}

const MobileMenu: React.FC<Props> = ({ onRoleChange, roleChangeLoading }) => {
  const router = useRouter();
  const { logOut } = useAuth();
  const userdata = useSelector((state: RootState) => state.user);
  const { user, ...restUserDetails } = userdata;
  const isLoggedIn = restUserDetails?.isAuthenticated;
  const userRoles: string[] = user?.roles || [];
  const currentRole = user?.activeRole || '';
  const userName = user?.name || '';

  return (
    <YStack
      position='absolute'
      top='100%'
      left={0}
      right={0}
      backgroundColor='$cardBackground'
      padding='$3'
      borderBottomLeftRadius='$4'
      borderBottomRightRadius='$4'
      zIndex={999}
      shadowColor='$shadowColor'
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.25}
      shadowRadius={3.84}
      elevation={5}
    >
      <YStack space='$2' marginTop='$10'>
        <Button
          onPress={() => {
            router.push('/login');
          }}
          icon={
            isLoggedIn ? <FaUserCircle size={18} /> : <FaRegUser size={18} />
          }
          backgroundColor='$background'
          color='$text'
          justifyContent='flex-start'
        >
          {isLoggedIn ? userName : 'Login / Sign Up'}
        </Button>

        {userRoles.length > 1 && (
          <AsyncSelect
            loading={roleChangeLoading}
            options={userRoles.map((role) => ({
              label: startCase(role),
              value: role,
            }))}
            groupLabel='Available Roles'
            size='$3'
            value={currentRole}
            onChange={onRoleChange}
          />
        )}

        {isLoggedIn && (
          <>
            <Button
              onPress={() => router.push('/account/orders')}
              icon={<FiPackage size={18} />}
              backgroundColor='$background'
              color='$text'
              justifyContent='flex-start'
            >
              My Orders
            </Button>
            <Button
              onPress={() => router.push('/account/wishlist')}
              icon={<FaHeart size={18} />}
              backgroundColor='$background'
              color='$text'
              justifyContent='flex-start'
            >
              Wishlist
            </Button>
            {(currentRole === 'admin' || currentRole === 'superAdmin') && (
              <Button
                onPress={() => router.push('/admin/dashboard')}
                backgroundColor='$background'
                color='$text'
                justifyContent='flex-start'
              >
                Admin Dashboard
              </Button>
            )}
            {currentRole === 'seller' && (
              <Button
                onPress={() => router.push('/admin/product')}
                backgroundColor='$background'
                color='$text'
                justifyContent='flex-start'
              >
                Seller Dashboard
              </Button>
            )}
          </>
        )}

        <Button
          onPress={() => router.push('/cart')}
          icon={<RiShoppingCart2Line size={18} />}
          backgroundColor='$background'
          color='$text'
          justifyContent='flex-start'
        >
          Cart
        </Button>

        {(!isLoggedIn || !userRoles.includes('seller')) && (
          <Button
            onPress={() =>
              router.push('/login?redirect=seller/seller-registration')
            }
            icon={<LiaGiftsSolid size={18} />}
            backgroundColor='$background'
            color='$text'
            justifyContent='flex-start'
          >
            Become a Seller
          </Button>
        )}

        {isLoggedIn && (
          <Button
            onPress={logOut}
            backgroundColor='$primary'
            color='white'
            marginTop='$2'
          >
            Logout
          </Button>
        )}

        <XStack
          justifyContent='space-between'
          alignItems='center'
          marginTop='$2'
        >
          <Text>Theme</Text>
          <ThemeToggle />
        </XStack>
      </YStack>
    </YStack>
  );
};

export default MobileMenu;
