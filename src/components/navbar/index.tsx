'use client';
import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Popover, Button, Image, Separator, Text, Card } from 'tamagui';
import { View } from '@tamagui/core';
import { FiPackage } from 'react-icons/fi';
import { LiaGiftsSolid } from 'react-icons/lia';
import { RiShoppingCart2Line } from 'react-icons/ri';
import {
  FaSearch,
  FaMoon,
  FaSun,
  FaHeart,
  FaRegUser,
  FaUserCircle,
} from 'react-icons/fa';
import { RootState } from '@/states/store/store';
import { toggleTheme } from '@/states/slices/themeSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuth from '../auth/useAuth';
import { ServiceErrorManager } from '@/helpers/service';
import { UserSwitchRoleService } from '@/services/auth';
import { setUser } from '@/states/slices/authSlice';
import AsyncSelect from '../appComponets/select/AsyncSelect';
import { startCase } from 'lodash-es';
import axios from 'axios';
import TMGPopover from '../appComponets/popover/Popover';

const Navbar: FC = () => {
  const { logOut } = useAuth();

  const router = useRouter();
  const {
    theme,
    user: { user, ...restUserDetails },
  } = useSelector((state: RootState) => state);

  const [roleChangeLoaidng, setRoleChangeLoaidng] = useState<boolean>(false);
  const dispatch = useDispatch();
  const isLoggedIn = restUserDetails?.isAuthenticated;
  const userRoles: string[] = user?.roles || [];
  const currentRole = user?.activeRole || '';
  const userName = user?.name || '';

  const handleRoleChange = async (role: string) => {
    setRoleChangeLoaidng(true);
    const [err, data] = await ServiceErrorManager(
      UserSwitchRoleService({
        data: {
          payload: {
            selectedRole: role,
          },
        },
      }),
      {}
    );
    dispatch(setUser(data.user));

    if (typeof window !== 'undefined') {
      localStorage.setItem('sessionToken', data.sessionToken);
    }

    //  localStorage.setItem('sessionToken', data.sessionToken);
    setRoleChangeLoaidng(false);
  };

  return (
    <Card
      flex={1}
      flexDirection='row'
      padding='$3'
      //@ts-ignore
      position='sticky'
      zIndex={1000}
      width='100%'
      top={0}
      borderRadius={0}
      backgroundColor='$cardBackground'
    >
      <div
        className='cursor-pointer rounded-3xl'
        onClick={() => router.push('/')}
        style={{ borderRadius: '100px' }}
      >
        <Image
          src={process.env.NEXT_PUBLIC_ECOMMERCE_LOGO}
          //alt='Tenet barzar Logo'
          width={120}
          borderRadius='$10'
          height={40}
          style={{ borderRadius: '100px' }}
          className=' rounded-lg'
        />
      </div>

      <View flex={1} marginHorizontal='$4'>
        <div
          className={`flex items-center space-x-2 w-full ${
            theme.mode === 'DARK' ? ' bg-darkBgbutton' : ' bg-ligthBgbutton'
          } p-1 rounded-md`}
        >
          <FaSearch size={20} color='#666' />
          <input
            className='w-full p-1.5'
            style={{ outline: 'none', backgroundColor: 'transparent' }}
            placeholder='Search for products, brands, and more'
          />
        </div>
      </View>

      {isLoggedIn ? (
        <TMGPopover
          placement='bottom'
          size='medium'
          trigger={
            <Button
              backgroundColor='$background'
              fontSize='$3'
              color='$text'
              padding='$2'
              marginRight='$2'
              icon={<FaUserCircle size={18} />}
            >
              {userName}
            </Button>
          }
          content={
            <View padding='$3' width={250}>
              <Text fontWeight='bold' marginBottom='$2'>
                Hello, {userName}
              </Text>

              {userRoles.length > 1 && (
                <AsyncSelect
                  loading={roleChangeLoaidng}
                  options={[
                    ...userRoles.map((role) => ({
                      label: startCase(role),
                      value: role,
                    })),
                  ]}
                  groupLabel='Available Roles'
                  size='$3'
                  value={currentRole}
                  onChange={handleRoleChange}
                />
              )}

              <Separator marginVertical='$2' />

              <Button
                size='$3.5'
                //onPress={generatePDF}
                onPress={() => router.push('account/orders')}
                icon={<FiPackage size={16} />}
                justifyContent='flex-start'
                backgroundColor='transparent'
                color='$text'
                marginBottom='$1'
              >
                My Orders
              </Button>

              <Button
                onPress={() => router.push('account/wishlist')}
                icon={<FaHeart size={16} />}
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
                  onPress={() => router.push('/admin/dashboard')}
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
                  onPress={() => router.push('/admin/product')}
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
                }}
                justifyContent='center'
                backgroundColor='$primary'
                color='white'
                size='$3.5'
              >
                Logout
              </Button>
            </View>
          }
        />
      ) : (
        <TMGPopover
          placement='bottom'
          size='medium'
          trigger={
            <Button
              backgroundColor='$background'
              fontSize='$3'
              color='$text'
              padding='$2'
              marginRight='$2'
              icon={<FaRegUser size={18} />}
            >
              Login
            </Button>
          }
          content={
            <View padding='$3' width={200}>
              <View
                flex={1}
                flexDirection='row'
                justifyContent='space-between'
                marginBottom='$2'
              >
                <Link href='login'>
                  <Text>Login</Text>
                </Link>

                <Link
                  href='/signup'
                  style={{
                    textDecoration: 'none',
                    marginLeft: '10px',
                  }}
                >
                  <Text color='$primary'>Sign Up</Text>
                </Link>
              </View>

              <Separator marginVertical='$2' />

              <Button
                size='$3.5'
                onPress={() => router.push('/orders')}
                icon={<FiPackage size={16} />}
                justifyContent='flex-start'
                backgroundColor='transparent'
                color='$text'
                marginBottom='$1'
              >
                Track Orders
              </Button>

              <Button
                onPress={() => router.push('/wishlist')}
                icon={<FaHeart size={16} />}
                justifyContent='flex-start'
                backgroundColor='transparent'
                color='$text'
                size='$3.5'
              >
                Wishlist
              </Button>
            </View>
          }
        />
      )}

      <Button
        onPress={() => {
          router.push('/cart');
        }}
        fontSize='$3'
        flexDirection='row'
        alignItems='center'
        marginRight='$4'
        icon={<RiShoppingCart2Line size={20} />}
      >
        Cart
      </Button>

      {(!isLoggedIn || !userRoles.includes('seller')) && (
        <Button
          backgroundColor='$background'
          color='$text'
          padding='$2'
          fontSize='$3'
          marginRight='$2'
          icon={<LiaGiftsSolid size={20} />}
          onPress={() => router.push('/login?redirect=seller-registration')}
        >
          Become a Seller
        </Button>
      )}

      <div
        className='relative inline-flex items-center cursor-pointer'
        onClick={() => dispatch(toggleTheme())}
      >
        <div
          className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-all ${
            theme.mode === 'DARK' ? 'bg-gray-700' : ''
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center transform transition-transform ${
              theme.mode === 'DARK' ? 'translate-x-6' : ''
            }`}
          >
            {theme.mode === 'DARK' ? (
              <FaMoon size={12} className='text-gray-900' />
            ) : (
              <FaSun size={12} className='text-yellow-500' />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Navbar;
