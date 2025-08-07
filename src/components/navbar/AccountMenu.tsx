'use client';
import React from 'react';
import { Button, Separator, Text, View } from 'tamagui';
import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';
import { FiHeart, FiPackage, FiUser } from 'react-icons/fi';
import AsyncSelect from '../appComponets/select/AsyncSelect';
import { startCase } from 'lodash-es';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store/store';
import useAuth from '../auth/useAuth';
import { useDarkMode } from '@/hook/useDarkMode';

interface AccountMenuProps {
  onRoleChange: (role: string) => void;
  roleChangeLoading: boolean;
  screenXs?: boolean;
}

const AccountMenu: React.FC<AccountMenuProps> = ({
  onRoleChange,
  roleChangeLoading,
  screenXs,
}) => {
  const isDark = useDarkMode();
  const router = useRouter();
  const { logOut } = useAuth();
  const userdata = useSelector((state: RootState) => state.user);
  const { user, ...restUserDetails } = userdata;
  const isLoggedIn = restUserDetails?.isAuthenticated;
  const userRoles: string[] = user?.roles || [];
  const currentRole = user?.activeRole || '';
  const userName = user?.name || '';

  return (
    <View padding='$3' width={screenXs ? 200 : 250}>
      {isLoggedIn ? (
        <>
          <Text fontWeight='bold' marginBottom='$2'>
            Hello, {userName}
          </Text>

          {userRoles.length > 1 && (
            <AsyncSelect
              loading={roleChangeLoading}
              options={[
                ...userRoles.map((role) => ({
                  label: startCase(role),
                  value: role,
                })),
              ]}
              groupLabel='Available Roles'
              size='$3'
              value={currentRole}
              onChange={onRoleChange}
            />
          )}

          <Separator marginVertical='$2' />

          <Button
            size='$3.5'
            onPress={() => {
              router.push('/account/profile');
            }}
            icon={<FiUser size={16} color={isDark ? '#f0f2f5' : ''} />}
            justifyContent='flex-start'
            backgroundColor='transparent'
            color='$text'
            marginBottom='$1'
          >
            My Profile
          </Button>
          <Button
            size='$3.5'
            onPress={() => {
              router.push('/account/orders');
            }}
            icon={<FiPackage size={16} color={isDark ? '#f0f2f5' : ''} />}
            justifyContent='flex-start'
            backgroundColor='transparent'
            color='$text'
            marginBottom='$1'
          >
            My Orders
          </Button>

          <Button
            onPress={() => {
              router.push('/account/wishlist');
            }}
            icon={<FiHeart size={16} color={isDark ? '#f0f2f5' : ''} />}
            justifyContent='flex-start'
            backgroundColor='transparent'
            color='$text'
            size='$3.5'
            marginBottom='$1'
          >
            Wishlist
          </Button>

          {(currentRole === 'admin' || currentRole === 'superAdmin') && (
            <Button
              onPress={() => {
                router.push('/admin/dashboard');
              }}
              justifyContent='flex-start'
              backgroundColor='transparent'
              color='$text'
              size='$3.5'
              marginBottom='$1'
            >
              Admin Dashboard
            </Button>
          )}

          {currentRole === 'seller' && (
            <Button
              onPress={() => {
                router.push('/admin/product');
              }}
              justifyContent='flex-start'
              backgroundColor='transparent'
              color='$text'
              size='$3.5'
              marginBottom='$1'
            >
              Seller Dashboard
            </Button>
          )}

          <Separator marginVertical='$2' />

          <Button
            onPress={() => {
              logOut();
              //  setMobileMenuOpen(false);
            }}
            justifyContent='center'
            backgroundColor='$primary'
            color='white'
            size='$3.5'
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <View
            flex={1}
            flexDirection='row'
            justifyContent='space-between'
            marginBottom='$2'
          >
            <Link href='/login'>
              <Text>Login</Text>
            </Link>

            {/* <Link
              href='/signup'
              style={{
                textDecoration: 'none',
                marginLeft: '10px',
              }}
            >
              <Text color='$primary'>Sign Up</Text>
            </Link> */}
          </View>

          <Separator marginVertical='$2' />

          <Button
            size='$3.5'
            onPress={() => {
              router.push('/account/orders');
              //  setMobileMenuOpen(false);
            }}
            icon={<FiPackage size={16} />}
            justifyContent='flex-start'
            backgroundColor='transparent'
            color='$text'
            marginBottom='$1'
          >
            Track Orders
          </Button>

          <Button
            onPress={() => {
              router.push('/account/wishlist');
              //  setMobileMenuOpen(false);
            }}
            icon={<FaHeart size={16} />}
            justifyContent='flex-start'
            backgroundColor='transparent'
            color='$text'
            size='$3.5'
          >
            Wishlist
          </Button>
        </>
      )}
    </View>
  );
};

export default AccountMenu;
