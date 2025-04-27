'use client';

import { useDarkMode } from '@/hook/useDarkMode';
import { useScreen } from '@/hook/useScreen';
import { RootState } from '@/states/store/store';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { IconType } from 'react-icons';
import { FaHeart } from 'react-icons/fa';
import { GiShoppingBag } from 'react-icons/gi';
import { IoMenu } from 'react-icons/io5';
import { RiDashboardFill } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { Card, XStack, YStack, Text, Button } from 'tamagui';

const CustomerSideBar: FC = () => {
  const {
    user: { user },
  } = useSelector((state: RootState) => state);
  const isDark = useDarkMode();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState<boolean>(false);
  const screen = useScreen();
  return (
    <>
      {screen.xs && (
        <button id='hamburger' onClick={() => setShowModal(true)}>
          <IoMenu />
        </button>
      )}

      <aside
        onBlur={() => setShowModal(false)}
        className={` ${isDark ? ' bg-darkBg ' : 'bg-ligthBg'} `}
        style={
          screen.xs
            ? {
                width: '20rem',
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: showModal ? '0' : '-20rem',
                transition: 'all 0.5s',
              }
            : {}
        }
      >
        <Card borderRadius={0} padding='$2' width='full'>
          <XStack gap='$2'>
            <img
              height={50}
              width={50}
              src='https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg'
            />
            <YStack marginTop='$2'>
              <Text fontSize='$3'>Hello</Text>
              <Text>{user?.name}</Text>
            </YStack>
          </XStack>
        </Card>
        <DivOne location={pathname} />
        {screen.xs && (
          <button id='close-sidebar' onClick={() => setShowModal(false)}>
            Close
          </button>
        )}
      </aside>
    </>
  );
};

export default CustomerSideBar;

const DivOne = ({ location }: { location: string }) => {
  return (
    <div>
      <ul>
        <Li
          url='/orders'
          text='My Orders'
          Icon={() => <GiShoppingBag size={16} />}
          location={location}
        />
        <Li
          url='/wishlist'
          text='My Wishlist'
          Icon={() => <FaHeart size={16} />}
          location={location}
        />
      </ul>
    </div>
  );
};

interface LiProps {
  url: string;
  text: string;
  location: string;
  Icon: IconType;
}
const Li = ({ url, text, location, Icon }: LiProps) => {
  const router = useRouter();

  return (
    <li>
      <Button
        width='100%'
        size='$3'
        onPress={() => router.push(url)}
        backgroundColor={location === url ? '$primary' : ''}
        chromeless={location !== url}
      >
        <span className='flex items-center gap-x-1.5 w-full whitespace-nowrap'>
          <div>
            <Icon size={18} />
          </div>
          {text}
        </span>
      </Button>
    </li>
  );
};
