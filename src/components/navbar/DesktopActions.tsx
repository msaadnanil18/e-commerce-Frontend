'use client';
import { Button, XStack } from 'tamagui';
import { RiShoppingCart2Line } from 'react-icons/ri';
import { LiaGiftsSolid } from 'react-icons/lia';
import { FaUserCircle, FaRegUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store/store';
import TMGPopover from '../appComponets/popover/Popover';
import AccountMenu from './AccountMenu';

interface Props {
  onRoleChange: (role: string) => void;
  roleChangeLoading: boolean;
}

const DesktopActions: React.FC<Props> = ({
  onRoleChange,
  roleChangeLoading,
}) => {
  const router = useRouter();
  const userData = useSelector((state: RootState) => state.user);
  const { user, ...restUserDetails } = userData;
  const isLoggedIn = restUserDetails.isAuthenticated;
  const userRoles: string[] = user?.roles || [];
  const userName = user?.name || '';

  return (
    <XStack alignItems='center' space='$2'>
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
            icon={
              isLoggedIn ? <FaUserCircle size={18} /> : <FaRegUser size={18} />
            }
          >
            {isLoggedIn ? userName : 'Login'}
          </Button>
        }
        content={
          <AccountMenu
            onRoleChange={onRoleChange}
            roleChangeLoading={roleChangeLoading}
          />
        }
      />
      <Button
        onPress={() => router.push('/cart')}
        fontSize='$3'
        flexDirection='row'
        alignItems='center'
        marginRight='$2'
        icon={<RiShoppingCart2Line size={20} />}
      >
        Cart
      </Button>
      {(!isLoggedIn || !userRoles.includes('seller')) && (
        <Button
          fontSize='$3'
          flexDirection='row'
          alignItems='center'
          marginRight='$2'
          onPress={() =>
            router.push('/login?redirect=seller/seller-registration')
          }
          icon={<LiaGiftsSolid size={20} />}
        >
          Become a Seller
        </Button>
      )}
    </XStack>
  );
};

export default DesktopActions;
