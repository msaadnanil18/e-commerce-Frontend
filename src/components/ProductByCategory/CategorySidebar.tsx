import React, { FC, useState } from 'react';
import {
  YStack,
  XStack,
  Button,
  Text,
  ScrollView,
  Stack,
  styled,
  AnimatePresence,
} from 'tamagui';
import { AiOutlineMenu as Menu, AiOutlineClose as X } from 'react-icons/ai';
import { IProductCategory } from '@/types/productCategory';
import RenderDriveFile from '../appComponets/fileupload/RenderDriveFile';
import { startCase, toLower } from 'lodash-es';
import TmgDrawer from '../appComponets/Drawer/TmgDrawer';
import { useScreen } from '@/hook/useScreen';
import { useRouter } from 'next/navigation';

const MenuItem = styled(XStack, {
  // padding: '$2',
  // paddingHorizontal: '$2',
  // marginHorizontal: '$4',
  marginVertical: '$2',
  borderRadius: '$4',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',

  hoverStyle: {
    backgroundColor: '$backgroundHover',
    transform: 'translateX(6px)',
    scale: 1.02,
    shadowColor: '$primary',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },

  pressStyle: {
    backgroundColor: '$backgroundPress',
    scale: 0.98,
    transform: 'translateX(2px)',
  },

  variants: {
    active: {
      true: {
        backgroundColor: '$backgroundHover',
        borderLeftWidth: 4,
        borderLeftColor: '$primary',
        shadowColor: '$primary',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
    },
  },
});

const MenuImage = styled(Stack, {
  // width: 48,
  height: 48,
  borderRadius: '$4',
  overflow: 'hidden',
  position: 'relative',
  marginRight: '$4',
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,

  variants: {
    active: {
      true: {
        borderWidth: 2,
        borderColor: '$color9',
        shadowColor: '$color9',
        shadowOpacity: 0.3,
      },
    },
  },
});

interface ISideMenuBarProps {
  subCategorys?: Array<IProductCategory>;
  searchParams: { category?: string; subCategory?: string };
  params: { categoryId: string };
}
const SideMenuBar: FC<ISideMenuBarProps> = ({
  subCategorys,
  params,
  searchParams,
}) => {
  const router = useRouter();
  const screen = useScreen();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleClick = (item: IProductCategory) => {
    router.push(
      `/${params.categoryId}?category=${toLower(item.title)}&subCategory=${
        item._id
      }`
    );
  };

  const menuItems = (subCategorys || []).map((item) => {
    const isActive = searchParams.subCategory === item._id;
    return (
      <MenuItem
        key={item._id}
        active={isActive}
        padding={screen.xs ? '$1' : '$2'}
        paddingHorizontal={screen.xs ? '$1' : '$2'}
        marginHorizontal={screen.xs ? '$2' : '$6'}
        onPress={() => handleClick(item)}
      >
        <MenuImage active={isActive} width={screen.xs ? 30 : 48}>
          {item.thumbnail ? (
            <RenderDriveFile
              file={item.thumbnail as File}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <img
              src='https://res.cloudinary.com/dx4rquov3/image/upload/v1752619926/altImage_monhto.png'
              alt={item.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </MenuImage>
        {!screen.xs && (
          <AnimatePresence>
            <YStack flex={1}>
              <Text
                fontSize='$3'
                fontWeight={isActive ? '600' : '500'}
                color={isActive ? '$color12' : '$color11'}
              >
                {startCase(item.title)}
              </Text>
            </YStack>
          </AnimatePresence>
        )}
      </MenuItem>
    );
  });

  const _menuItems = (subCategorys || []).map((item) => {
    const isActive = searchParams.subCategory === item._id;
    return (
      <MenuItem
        key={item._id}
        active={isActive}
        onPress={() => handleClick(item)}
      >
        <MenuImage active={isActive} width={48}>
          {item.thumbnail ? (
            <RenderDriveFile
              file={item.thumbnail as File}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <img
              src='https://res.cloudinary.com/dx4rquov3/image/upload/v1752619926/altImage_monhto.png'
              alt={item.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </MenuImage>
        {screen.xs && (
          <AnimatePresence>
            <YStack
              flex={1}
              enterStyle={{ opacity: 0, x: -20 }}
              exitStyle={{ opacity: 0, x: -20 }}
            >
              <Text
                fontSize='$3'
                fontWeight={isActive ? '600' : '500'}
                color={isActive ? '$color12' : '$color11'}
              >
                {startCase(item.title)}
              </Text>
            </YStack>
          </AnimatePresence>
        )}
      </MenuItem>
    );
  });

  const SidebarBody = (
    <YStack>
      {screen.xs && (
        <XStack padding={'$3'} borderBottomWidth={1} width='$5'>
          <Button
            size='$2'
            circular
            backgroundColor='$color5'
            borderColor='$color6'
            icon={!isCollapsed ? <Menu size={17} /> : <X size={17} />}
            onPress={() => setIsCollapsed(!isCollapsed)}
          />
        </XStack>
      )}
      <ScrollView
        flex={1}
        maxHeight='calc(100vh - 74px)'
        maxWidth={300}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <YStack padding='$2' marginTop='$2'>
          {menuItems}
        </YStack>
      </ScrollView>
    </YStack>
  );

  const _SidebarBody = (
    <YStack>
      {screen.xs && (
        <XStack padding='$4' borderBottomWidth={1}>
          <Button
            size='$3'
            circular
            backgroundColor='$color5'
            borderColor='$color6'
            icon={!isCollapsed ? <Menu size={20} /> : <X size={20} />}
            onPress={() => setIsCollapsed(!isCollapsed)}
          />
        </XStack>
      )}
      <ScrollView
        flex={1}
        maxHeight={500}
        maxWidth={300}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <YStack padding='$2' marginTop='$2'>
          {_menuItems}
        </YStack>
      </ScrollView>
    </YStack>
  );

  return (
    <>
      {screen.xs && (
        <TmgDrawer
          forceRemoveScrollEnabled
          showCloseButton={false}
          open={isCollapsed}
          onOpenChange={setIsCollapsed}
        >
          {_SidebarBody}
        </TmgDrawer>
      )}
      {SidebarBody}
    </>
  );
};

export default SideMenuBar;
