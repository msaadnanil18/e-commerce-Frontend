'use client';
import type { SheetProps } from '@tamagui/sheet';
import { Sheet } from '@tamagui/sheet';
import React, { FC, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { Button, XStack, H6, View, YStack } from 'tamagui';

export type DrawerSize = 'small' | 'medium' | 'large' | 'full';
const spModes = ['percent', 'constant', 'fit', 'mixed'] as const;
export interface DrawerProps extends Omit<SheetProps, 'position'> {
  title?: string;
  icon?: React.ReactNode;
  showCloseButton?: boolean;
  contentPadding?: number | string;
  overlayOpacity?: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
  snapPoints?: (number | string)[];
}

const TmgDrawer: FC<DrawerProps> = ({
  title,
  icon,
  showCloseButton = true,
  contentPadding = '$2',
  children,
  footer,
  modal = true,
  snapPointsMode = 'percent',
  snapPoints = [75],
  ...props
}) => {
  const [position, setPosition] = useState(0);

  return (
    <Sheet
      {...props}
      forceRemoveScrollEnabled={props.open}
      modal={modal}
      position={position}
      onPositionChange={setPosition}
      dismissOnSnapToBottom
      zIndex={100_000}
      snapPoints={snapPoints}
      snapPointsMode={snapPointsMode}
    >
      <Sheet.Overlay
        backgroundColor='$cardBackground'
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame>
        <YStack width='100%'>
          <XStack
            width='100%'
            padding='$3'
            justifyContent='space-between'
            alignItems='center'
          >
            <XStack alignItems='center' space='$2'>
              {icon && icon}
              {title && <H6>{title}</H6>}
            </XStack>

            {showCloseButton && (
              <Button
                size='$3'
                circular
                icon={<MdOutlineCancel size={16} />}
                onPress={() => props.onOpenChange?.(false)}
              />
            )}
          </XStack>

          <View flex={1} padding={contentPadding}>
            {children}
          </View>

          {/* Footer area */}
          {footer && (
            <XStack
              borderTopWidth={1}
              borderTopColor='$borderColor'
              padding='$3'
              justifyContent='flex-end'
            >
              {footer}
            </XStack>
          )}
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};

export default TmgDrawer;
