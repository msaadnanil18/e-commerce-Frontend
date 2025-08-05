'use client';
import React, { FC, useState } from 'react';
import { Card, View, XStack } from 'tamagui';
import { FiMenu } from 'react-icons/fi';
import { FaTimes } from 'react-icons/fa';
import { useScreen } from '@/hook/useScreen';
import DesktopActions from './DesktopActions';
import Logo from './Logo';
import MobileMenu from './MobileMenu';
import { UserSwitchRoleService } from '@/services/auth';
import { ServiceErrorManager } from '@/helpers/service';
import { setUser } from '@/states/slices/authSlice';
import { useDispatch } from 'react-redux';
import SearchInput from './SearchInput';
import ThemeToggle from './ThemeToggle';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  showSearchInput?: boolean;
  showThemeToggle?: boolean;
  showRoleChange?: boolean;
  showMobileMenu?: boolean;
}

const Navbar: FC<NavbarProps> = ({
  showSearchInput = true,
  showThemeToggle = true,
  showRoleChange = true,
  showMobileMenu = true,
}) => {
  const router = useRouter();
  const screen = useScreen();
  const dispatch = useDispatch();
  const [roleChangeLoading, setRoleChangeLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleChange = async (role: string) => {
    setRoleChangeLoading(true);
    const [err, data] = await ServiceErrorManager(
      UserSwitchRoleService({ data: { payload: { selectedRole: role } } }),
      {}
    );
    if (!err) {
      dispatch(setUser(data.user));
      localStorage.setItem('sessionToken', data.sessionToken);
    }
    setRoleChangeLoading(false);

    if (role === 'seller') {
      router.push('/admin/product');
    }
    if (role === 'admin' || role === 'superAdmin') {
      router.push('/admin/dashboard');
    }
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <Card
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
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
        <XStack flex={1} alignItems='center' justifyContent='space-between'>
          <XStack flex={1} alignItems='center'>
            <Logo />
            {showSearchInput && !screen.xs && (
              <View flex={1} marginHorizontal='$4'>
                <SearchInput />
              </View>
            )}
          </XStack>

          {!screen.xs ? (
            <>
              {showRoleChange && (
                <DesktopActions
                  onRoleChange={handleRoleChange}
                  roleChangeLoading={roleChangeLoading}
                />
              )}
              {showThemeToggle && <ThemeToggle />}
            </>
          ) : showMobileMenu ? (
            mobileMenuOpen ? (
              <FaTimes onClick={() => setMobileMenuOpen(false)} size={24} />
            ) : (
              <FiMenu size={24} onClick={() => setMobileMenuOpen(true)} />
            )
          ) : (
            <ThemeToggle />
          )}
        </XStack>

        {showMobileMenu && !screen.md && mobileMenuOpen && (
          <MobileMenu
            onRoleChange={handleRoleChange}
            roleChangeLoading={roleChangeLoading}
          />
        )}
      </Card>
    </nav>
  );
};

export default Navbar;
