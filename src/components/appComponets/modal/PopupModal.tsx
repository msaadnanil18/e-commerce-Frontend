'use client';
import React, { FC, ReactNode } from 'react';
import { Button, ButtonProps, Dialog, Spinner, XStack } from 'tamagui';

interface ModalProps {
  open?: boolean;
  onClose?: (open: boolean) => void;
  title?: string;
  description?: string;
  content?: ReactNode;
  showCancelButton?: boolean;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void | Promise<void>;
  isLoading?: boolean;
  size?: 'small' | 'medium' | 'large';
  children?: ReactNode;
  confirmButtonProps?: ButtonProps;
  cancelTextButtonProps?: ButtonProps;
  height?: number | string;
  width?: number | string;
}

const Modal: FC<ModalProps> = ({
  open = false,
  onClose,
  title,
  description,
  content,
  cancelTextButtonProps,
  confirmButtonProps,
  showCancelButton = true,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  onConfirm,
  isLoading = false,
  size = 'medium',
  width,
  height,
  children,
}) => {
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    // if (onClose) {
    //   onClose(false);
    // }
  };

  const getWidth = () => {
    switch (size) {
      case 'small':
        return 300;
      case 'large':
        return 600;
      case 'medium':
      default:
        return 400;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay
          key='overlay'
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key='content'
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          padding='$4'
          height={height}
          width={width || getWidth()}
        >
          {title && (
            <Dialog.Title fontSize='$4' fontWeight='bold'>
              {title}
            </Dialog.Title>
          )}

          {description && (
            <Dialog.Description>{description}</Dialog.Description>
          )}

          {content && <div className='mt-4'>{content}</div>}

          {children}

          <XStack space='$3' justifyContent='flex-end' marginTop='$4'>
            {showCancelButton && (
              <Dialog.Close asChild>
                <Button size='$3' variant='outlined' {...cancelTextButtonProps}>
                  {cancelText}
                </Button>
              </Dialog.Close>
            )}

            {onConfirm && (
              <Button
                size='$3'
                onPress={handleConfirm}
                disabled={isLoading}
                {...confirmButtonProps}
                icon={isLoading ? <Spinner /> : null}
              >
                {confirmText}
              </Button>
            )}
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default Modal;
