'use client';

import { FC, useState } from 'react';
import { AiFillFileText } from 'react-icons/ai';
import { GiShoppingBag } from 'react-icons/gi';
import { IoIosPeople } from 'react-icons/io';
import {
  RiAdminFill,
  RiCoupon3Fill,
  RiDashboardFill,
  RiShoppingBag3Fill,
} from 'react-icons/ri';

import { usePathname } from 'next/navigation';

import { permissions } from '@/constant/permissions';
import { useDarkMode } from '@/hook/useDarkMode';
import usePermission from '@/hook/usePermission';
import { useScreen } from '@/hook/useScreen';
import { RootState } from '@/states/store/store';
import { useRouter } from 'next/navigation';
import { IconType } from 'react-icons';
import { FaBriefcase, FaTags } from 'react-icons/fa';
import { IoMenu } from 'react-icons/io5';
import {
  MdHome,
  MdManageAccounts,
  MdOutlineMiscellaneousServices,
} from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Button, Card, Paragraph, Text, XStack, YStack } from 'tamagui';

const AdminSidebar: FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
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
        {/* <DivTwo location={pathname} /> */}
        <DivThree location={pathname} />

        {screen.xs && (
          <button id='close-sidebar' onClick={() => setShowModal(false)}>
            Close
          </button>
        )}
      </aside>
    </>
  );
};

const DivOne = ({ location }: { location: string }) => {
  const { hasPermission } = usePermission();
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <div>
      <ul>
        {(user?.activeRole === 'admin' ||
          user?.activeRole === 'superAdmin') && (
          <Li
            url='/admin/dashboard'
            text='Dashboard'
            Icon={RiDashboardFill}
            location={location}
          />
        )}
        <Li
          url='/admin/product'
          text='Product'
          Icon={RiShoppingBag3Fill}
          location={location}
        />
        {hasPermission(permissions.CAN_VIEW_SELLER_LIST) && (
          <Li
            url='/admin/seller'
            text='Seller'
            Icon={IoIosPeople}
            location={location}
          />
        )}
        {hasPermission(permissions.CAN_VIEW_ORDERS) && (
          <Li
            url='/admin/orders'
            text='Orders'
            Icon={GiShoppingBag}
            location={location}
          />
        )}
        {hasPermission(permissions.CAN_VIEW_ADMIN_AND_SUPER_ADMIN_LIST) && (
          <Li
            url='/admin/role-assign'
            text='Admin'
            Icon={RiAdminFill}
            location={location}
          />
        )}

        <Li
          url='/admin/transaction'
          text='Transaction'
          Icon={AiFillFileText}
          location={location}
        />
        {hasPermission(permissions.CAN_VIEW_DELIVERY_ZONE) && (
          <Li
            url='/admin/config/delivery-zone'
            text='Delivery Zone'
            Icon={MdManageAccounts}
            location={location}
          />
        )}
        {hasPermission(permissions.CAN_VIEW_SERVICE_CHARGE) && (
          <Li
            url='/admin/config/service-charge'
            text='Service Charge'
            Icon={MdOutlineMiscellaneousServices}
            location={location}
          />
        )}

        {hasPermission(permissions.CAN_VIEW_COMMISSION_CONFIGURATION) && (
          <Li
            url='/admin/config/commission'
            text='Commission Config'
            Icon={FaBriefcase}
            location={location}
          />
        )}

        {/* <Li
          url='/admin/config/product-category'
          text='Category Config'
          Icon={FaBriefcase}
          location={location}
        /> */}

        {hasPermission(permissions.CAN_VIEW_HOME_PAGE_CONFIG) && (
          <Li
            url='/admin/config/home-page'
            text='Home page Config'
            Icon={MdHome}
            location={location}
          />
        )}

        {hasPermission(permissions.CAN_VIEW_PRODUCT_CATEGORY) && (
          <Li
            url='/admin/config/category'
            text='Products Catengory'
            Icon={FaTags}
            location={location}
          />
        )}
      </ul>
    </div>
  );
};

// const DivTwo = ({ location }: { location: string }) => (
//   <div>
//     <Paragraph size='$4' fontWeight='400'>
//       Charts
//     </Paragraph>
//     <ul>
//       <Li
//         url='/admin/chart/bar'
//         text='Bar'
//         Icon={FaChartBar}
//         location={location}
//       />
//       <Li
//         url='/admin/chart/pie'
//         text='Pie'
//         Icon={FaChartPie}
//         location={location}
//       />
//       <Li
//         url='/admin/chart/line'
//         text='Line'
//         Icon={FaChartLine}
//         location={location}
//       />
//     </ul>
//   </div>
// );

const DivThree = ({ location }: { location: string }) => (
  <div>
    <Paragraph size='$4' fontWeight='400'>
      Apps
    </Paragraph>
    <ul>
      {/* <Li
        url='/admin/app/stopwatch'
        text='Stopwatch'
        Icon={FaStopwatch}
        location={location}
      /> */}
      <Li
        url='/admin/app/coupon'
        text='Coupon'
        Icon={RiCoupon3Fill}
        location={location}
      />
      {/* <Li
        url='/admin/app/toss'
        text='Toss'
        Icon={FaGamepad}
        location={location}
      /> */}
    </ul>
  </div>
);

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

export default AdminSidebar;
