'use client';
import RenderDriveFile from '@/components/appComponets/fileupload/RenderDriveFile';
import PriceFormatter from '@/components/appComponets/PriceFormatter/PriceFormatter';
import { ServiceErrorManager } from '@/helpers/service';
import { RemoveProductFromWishlist } from '@/services/wishList';
import { IProduct } from '@/types/products';
import { IWishlist } from '@/types/wishList';
import { useRouter } from 'next/navigation';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { FaExclamationCircle, FaTrash } from 'react-icons/fa';
import {
  View,
  XStack,
  YStack,
  Text,
  Button,
  PopoverProps,
  Popover,
  Adapt,
} from 'tamagui';

const WishlistItem: FC<{
  product: IProduct;
  setWishList: Dispatch<SetStateAction<IWishlist | null>>;
  removeAnimation: string | null;
}> = ({ product, removeAnimation, setWishList }) => {
  const router = useRouter();
  const variant = product.variants[0];
  const isOutOfStock = variant.inventory <= 0;
  const isAnimating = removeAnimation === product._id;

  return (
    <View
      opacity={isAnimating ? 0 : 1}
      transform={[{ translateX: isAnimating ? 100 : 0 }]}
    >
      <XStack
        backgroundColor='$background'
        borderRadius='$4'
        marginBottom='$4'
        overflow='hidden'
        borderWidth={1}
        padding='$2'
        space='$2'
        borderColor='$borderColor'
      >
        <RenderDriveFile
          file={product.thumbnail}
          style={{ width: 80, height: 80 }}
        />

        <YStack flex={1} padding='$3' space='$2'>
          <Text
            onPress={() => router.push(`/product-details/${product._id}`)}
            hoverStyle={{
              color: '$linkColor',
              cursor: 'pointer',
            }}
            fontSize='$3'
            fontWeight='500'
          >
            {product.name}
          </Text>

          <XStack alignItems='center' space='$2'>
            <Text fontSize='$4' color='$primary' fontWeight='700'>
              <PriceFormatter value={variant.price} />
            </Text>
            {variant.discount > 0 && (
              <PriceFormatter value={variant.originalPrice} crossed />
            )}
            {variant.discount > 0 && (
              <Text
                fontSize='$3'
                backgroundColor='$blue3'
                color='$blue9'
                paddingHorizontal='$2'
                borderRadius='$1'
              >
                {variant.discount}% OFF
              </Text>
            )}
          </XStack>

          {isOutOfStock ? (
            <Text color='$red9' fontSize='$2' fontWeight='500'>
              <FaExclamationCircle size={12} style={{ marginRight: 4 }} /> Out
              of stock
            </Text>
          ) : (
            <Text color='$green9' fontSize='$2.5' fontWeight='500'>
              In stock: {variant.inventory} available
            </Text>
          )}
        </YStack>
        <XStack>
          <RemoveWishListconfirm
            product={product}
            setWishList={setWishList}
            shouldAdapt={true}
            placement='bottom'
          />
        </XStack>
      </XStack>
    </View>
  );
};

export default WishlistItem;

const RemoveWishListconfirm: FC<
  PopoverProps & {
    shouldAdapt?: boolean;
    product: IProduct;

    setWishList: Dispatch<SetStateAction<IWishlist | null>>;
  }
> = ({ shouldAdapt, ...props }) => {
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const handleRemoveFromWishlist = async (id: string) => {
    setIsRemoving(true);
    await ServiceErrorManager(
      RemoveProductFromWishlist({
        data: {
          usePayloadUpdate: true,
          payload: {
            product: id,
          },
        },
      }),
      {}
    );
    props.setWishList((prev) => ({
      ...prev!,
      products: prev?.products?.filter((product) => product._id !== id) || [],
    }));
    setIsRemoving(false);
  };
  return (
    <Popover
      open={open}
      size='$5'
      allowFlip
      stayInFrame
      offset={15}
      resize
      {...props}
    >
      <Popover.Trigger asChild>
        <Button
          size='$3'
          unstyled
          marginTop='$2'
          icon={<FaTrash size={14} />}
          onPress={() => setOpen(true)}
        />
      </Popover.Trigger>

      {shouldAdapt && (
        <Adapt platform='touch'>
          <Popover.Sheet modal dismissOnSnapToBottom>
            <Popover.Sheet.Frame padding='$4'>
              <Adapt.Contents />
            </Popover.Sheet.Frame>
            <Popover.Sheet.Overlay
              backgroundColor='$shadowColor'
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Popover.Sheet>
        </Adapt>
      )}

      <Popover.Content
        borderWidth={1}
        borderColor='$borderColor'
        width={300}
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
      >
        <Popover.Arrow borderWidth={1} borderColor='$borderColor' />

        <YStack gap='$3'>
          <XStack gap='$3'>
            <Text fontSize='$3'>
              Are you sure you want to remove this product?
            </Text>
          </XStack>

          <XStack>
            <Button size='$3' unstyled onPress={() => setOpen(false)}>
              <Text fontSize='$3' color='$gray10'>
                CANCEL
              </Text>
            </Button>
            <Button
              size='$3'
              unstyled
              disabled={isRemoving}
              onPress={async () => {
                await handleRemoveFromWishlist(props.product._id);
                setOpen(false);
              }}
            >
              <Text fontSize='$3' color='$red10'>
                {isRemoving ? 'REMOVING...' : 'YES, REMOVE'}
              </Text>
            </Button>
          </XStack>
        </YStack>
      </Popover.Content>
    </Popover>
  );
};
