'use client';
import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Image, Separator, Text, Card, XStack, YStack } from 'tamagui';
import { View } from '@tamagui/core';
import { FiPackage, FiMenu } from 'react-icons/fi';
import { LiaGiftsSolid } from 'react-icons/lia';
import { RiShoppingCart2Line } from 'react-icons/ri';
import {
  FaSearch,
  FaMoon,
  FaSun,
  FaHeart,
  FaRegUser,
  FaUserCircle,
  FaTimes,
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
import TMGPopover from '../appComponets/popover/Popover';
import { useScreen } from '@/hook/useScreen';

const Navbar: FC = () => {
  const screen = useScreen();
  const { logOut } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    theme,
    user: { user, ...restUserDetails },
  } = useSelector((state: RootState) => state);

  const [roleChangeLoading, setRoleChangeLoading] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const isLoggedIn = restUserDetails?.isAuthenticated;
  const userRoles: string[] = user?.roles || [];
  const currentRole = user?.activeRole || '';
  const userName = user?.name || '';

  const handleRoleChange = async (role: string) => {
    setRoleChangeLoading(true);
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

    setRoleChangeLoading(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Account options menu content
  const accountMenuContent = (
    <View padding='$3' width={screen.xs ? 200 : 250}>
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
              onChange={handleRoleChange}
            />
          )}

          <Separator marginVertical='$2' />

          <Button
            size='$3.5'
            onPress={() => {
              router.push('/account/orders');
              setMobileMenuOpen(false);
            }}
            icon={<FiPackage size={16} />}
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
              setMobileMenuOpen(false);
            }}
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
              onPress={() => {
                router.push('/admin/dashboard');
                setMobileMenuOpen(false);
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
                setMobileMenuOpen(false);
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
              setMobileMenuOpen(false);
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
            onPress={() => {
              router.push('/account/orders');
              setMobileMenuOpen(false);
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
              setMobileMenuOpen(false);
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
      {/* Main navbar layout */}
      <XStack
        flex={1}
        alignItems='center'
        justifyContent='space-between'
        flexWrap='nowrap'
      >
        {/* Logo */}
        <XStack flex={1} alignItems='center'>
          <div
            className='cursor-pointer rounded-3xl'
            onClick={() => router.push('/')}
            style={{ borderRadius: '100px' }}
          >
            <Image
              src={process.env.NEXT_PUBLIC_ECOMMERCE_LOGO}
              width={120}
              borderRadius='$10'
              height={40}
              style={{ borderRadius: '100px' }}
              className='rounded-lg'
            />
          </div>

          {!screen.xs && (
            <View flex={1} marginHorizontal='$4'>
              <div
                className={`flex items-center space-x-2 w-full ${
                  theme.mode === 'DARK' ? 'bg-darkBgbutton' : 'bg-ligthBgbutton'
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
          )}
        </XStack>

        {/* Desktop menu items - visible only on medium screens and larger */}
        {
          !screen.xs ? (
            <XStack alignItems='center' space='$2'>
              {/* Account Menu */}
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
                  content={accountMenuContent}
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
                  content={accountMenuContent}
                />
              )}

              {/* Cart Button */}
              <Button
                onPress={() => router.push('/cart')}
                fontSize='$3'
                flexDirection='row'
                alignItems='center'
                marginRight='$2'
                icon={<RiShoppingCart2Line size={20} />}
              >
                {screen.lg ? 'Cart' : null}
              </Button>

              {/* Become a Seller Button */}
              {(!isLoggedIn || !userRoles.includes('seller')) && (
                <Button
                  backgroundColor='$background'
                  color='$text'
                  padding='$2'
                  fontSize='$3'
                  marginRight='$2'
                  icon={<LiaGiftsSolid size={20} />}
                  onPress={() =>
                    router.push('/login?redirect=seller-registration')
                  }
                >
                  {screen.lg ? 'Become a Seller' : null}
                </Button>
              )}

              {/* Theme Toggle */}
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
            </XStack>
          ) : mobileMenuOpen ? (
            <FaTimes onClick={toggleMobileMenu} size={24} />
          ) : (
            <FiMenu size={24} onClick={toggleMobileMenu} />
          )
          /* Mobile menu hamburger icon - visible only on small screens */
          // <IconButton
          //   size="$3"
          //   onPress={toggleMobileMenu}
          //   icon={mobileMenuOpen ? <FaTimes size={24} /> : <FiMenu size={24} />}
          // />
        }
      </XStack>

      {/* Mobile menu - appears when hamburger is clicked */}
      {!screen.md && mobileMenuOpen && (
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
          {/* Mobile Search Bar */}
          <View marginBottom='$3'>
            <div
              className={`flex items-center space-x-2 w-full ${
                theme.mode === 'DARK' ? 'bg-darkBgbutton' : 'bg-ligthBgbutton'
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

          {/* Mobile Menu Items */}
          <YStack space='$2'>
            {/* Account Button for Mobile */}
            <Button
              onPress={() => {
                if (isLoggedIn) {
                  router.push('/account');
                } else {
                  router.push('/login');
                }
                setMobileMenuOpen(false);
              }}
              icon={
                isLoggedIn ? (
                  <FaUserCircle size={18} />
                ) : (
                  <FaRegUser size={18} />
                )
              }
              backgroundColor='$background'
              color='$text'
              justifyContent='flex-start'
            >
              {isLoggedIn ? userName : 'Login / Sign Up'}
            </Button>

            {/* Additional items for logged in users */}
            {isLoggedIn && (
              <>
                <Button
                  onPress={() => {
                    router.push('/account/orders');
                    setMobileMenuOpen(false);
                  }}
                  icon={<FiPackage size={18} />}
                  backgroundColor='$background'
                  color='$text'
                  justifyContent='flex-start'
                >
                  My Orders
                </Button>

                <Button
                  onPress={() => {
                    router.push('/account/wishlist');
                    setMobileMenuOpen(false);
                  }}
                  icon={<FaHeart size={18} />}
                  backgroundColor='$background'
                  color='$text'
                  justifyContent='flex-start'
                >
                  Wishlist
                </Button>

                {(currentRole === 'admin' || currentRole === 'superAdmin') && (
                  <Button
                    onPress={() => {
                      router.push('/admin/dashboard');
                      setMobileMenuOpen(false);
                    }}
                    backgroundColor='$background'
                    color='$text'
                    justifyContent='flex-start'
                  >
                    Admin Dashboard
                  </Button>
                )}

                {currentRole === 'seller' && (
                  <Button
                    onPress={() => {
                      router.push('/admin/product');
                      setMobileMenuOpen(false);
                    }}
                    backgroundColor='$background'
                    color='$text'
                    justifyContent='flex-start'
                  >
                    Seller Dashboard
                  </Button>
                )}
              </>
            )}

            {/* Cart Button for Mobile */}
            <Button
              onPress={() => {
                router.push('/cart');
                setMobileMenuOpen(false);
              }}
              icon={<RiShoppingCart2Line size={18} />}
              backgroundColor='$background'
              color='$text'
              justifyContent='flex-start'
            >
              Cart
            </Button>

            {/* Become a Seller Button for Mobile */}
            {(!isLoggedIn || !userRoles.includes('seller')) && (
              <Button
                onPress={() => {
                  router.push('/login?redirect=seller-registration');
                  setMobileMenuOpen(false);
                }}
                icon={<LiaGiftsSolid size={18} />}
                backgroundColor='$background'
                color='$text'
                justifyContent='flex-start'
              >
                Become a Seller
              </Button>
            )}

            {/* Log Out Button for Mobile */}
            {isLoggedIn && (
              <Button
                onPress={() => {
                  logOut();
                  setMobileMenuOpen(false);
                }}
                backgroundColor='$primary'
                color='white'
                marginTop='$2'
              >
                Logout
              </Button>
            )}

            {/* Theme Toggle for Mobile */}
            <XStack
              justifyContent='space-between'
              alignItems='center'
              marginTop='$2'
            >
              <Text>Theme</Text>
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
            </XStack>
          </YStack>
        </YStack>
      )}
    </Card>
  );
};

export default Navbar;
