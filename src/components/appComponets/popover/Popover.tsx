import React, { useState } from 'react';
import {
  Button,
  Text,
  View,
  YStack,
  XStack,
  Popover,
  PopoverProps,
} from 'tamagui';

interface CustomPopoverProps extends PopoverProps {
  trigger: React.ReactNode;
  title?: string;
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'small' | 'medium' | 'large';
  showArrow?: boolean;
  closeOnClickOutside?: boolean;
  onOpenChange?: (open: boolean) => void;
  width?: number | string;
}

const TMGPopover: React.FC<CustomPopoverProps> = ({
  trigger,
  title,
  content,
  placement = 'bottom',
  size = 'medium',
  showArrow = true,
  closeOnClickOutside = true,
  onOpenChange,
  width,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    onOpenChange?.(isOpen);
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { padding: 'sm', width: 200 };
      case 'large':
        return { padding: 'lg', width: 350 };
      case 'medium':
      default:
        return { padding: 'md', width: 250 };
    }
  };

  const { padding, width: contentWidth } = getSizeStyles();

  return (
    <Popover
      open={open}
      onOpenChange={handleOpenChange}
      placement={placement}
      size={size}
      allowFlip
    >
      <Popover.Trigger asChild>
        <View>{trigger}</View>
      </Popover.Trigger>

      <Popover.Content
        borderWidth={1}
        borderColor='$borderColor'
        shadowColor='$shadowColor'
        shadowRadius={5}
        shadowOffset={{ width: 0, height: 3 }}
        elevate
        width={width || contentWidth}
        enterStyle={{ scale: 0.9, opacity: 0 }}
        exitStyle={{ scale: 0.9, opacity: 0 }}
      >
        {showArrow && (
          <Popover.Arrow borderWidth={1} borderColor='$borderColor' />
        )}

        <YStack space='sm' padding={padding}>
          {title && (
            <XStack justifyContent='space-between' alignItems='center'>
              <Text fontWeight='bold' fontSize='$5'>
                {title}
              </Text>
              <Popover.Close>
                <Button
                  size='sm'
                  circular
                  icon='close'
                  chromeless
                  hoverStyle={{ backgroundColor: '$backgroundHover' }}
                />
              </Popover.Close>
            </XStack>
          )}

          <View>{content}</View>
        </YStack>
      </Popover.Content>
    </Popover>
  );
};

export default TMGPopover;
