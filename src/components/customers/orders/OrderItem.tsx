import RenderDriveFile from '@/components/appComponets/fileupload/RenderDriveFile';
import PriceFormatter from '@/components/appComponets/PriceFormatter/PriceFormatter';
import { useScreen } from '@/hook/useScreen';
import { IOrder } from '@/types/order';
import dayjs from 'dayjs';
import { FC, useState } from 'react';
import { FiChevronDown, FiChevronRight, FiTruck } from 'react-icons/fi';
import { GiShoppingBag } from 'react-icons/gi';
import { Card, XStack, Text, Separator, Button, YStack } from 'tamagui';
import OrderStatusBadge from './OrderStatusBadge';
import PaymentStatusBadge from './PaymentStatusBadge';
import { useRouter } from 'next/navigation';

interface OrderItemProps {
  item: IOrder;
}

const OrderItem: FC<OrderItemProps> = ({ item }) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const screen = useScreen();

  return (
    <Card bordered size='$2' marginHorizontal='$2' marginVertical='$2'>
      <Card.Header padded>
        <XStack
          justifyContent='space-between'
          alignItems='center'
          flexWrap='wrap'
          gap='$2'
        >
          <XStack space='$2' alignItems='center'>
            <Text fontSize={screen.sm ? '$3' : '$4'} fontWeight='bold'>
              #{item.orderNumber}
            </Text>
          </XStack>
          <XStack space='sm' flexWrap='wrap' gap='$1'>
            <OrderStatusBadge status={'pending'} />
            <PaymentStatusBadge status={item.paymentStatus} />
          </XStack>
        </XStack>
      </Card.Header>

      <Separator />

      <Card.Footer padded>
        <XStack
          justifyContent='space-between'
          alignItems='center'
          flexWrap='wrap'
          gap='$2'
        >
          <Text color='$gray10' fontSize={screen.sm ? '$2' : '$3'}>
            {dayjs(item.createdAt).format('MMM DD, YYYY')}
          </Text>
          <XStack
            space={screen.sm ? '$2' : '$5'}
            alignItems='center'
            flexWrap='wrap'
            gap='$1'
          >
            <Text fontWeight='bold' fontSize={screen.sm ? '$2' : '$3'}>
              <PriceFormatter value={item.totalAmount} />
            </Text>
            <Button
              unstyled
              padding={screen.sm ? 5 : 10}
              size={screen.sm ? '$2' : '$3'}
              chromeless
              onPress={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <Text
                  hoverStyle={{
                    color: '$linkColor',
                  }}
                  fontSize={screen.sm ? 10 : 12}
                >
                  <XStack alignItems='center' space='$1'>
                    <FiChevronDown size={screen.sm ? 14 : 18} />
                    <Text>Hide Details</Text>
                  </XStack>
                </Text>
              ) : (
                <Text
                  hoverStyle={{
                    color: '$linkColor',
                  }}
                  fontSize={screen.sm ? 10 : 12}
                >
                  <XStack alignItems='center' space='$1'>
                    <FiChevronRight size={screen.sm ? 14 : 18} />
                    <Text>View Details</Text>
                  </XStack>
                </Text>
              )}
            </Button>
          </XStack>
        </XStack>
      </Card.Footer>

      {expanded && (
        <YStack padding={screen.sm ? '$2' : '$4'} space='md'>
          <Separator />
          <Text fontWeight='bold'>Order Items ({item.items.length})</Text>

          {item.items.map((orderItem, idx) => (
            <Card key={idx} bordered size='$1' margin='$1'>
              <XStack padding={screen.sm ? '$2' : '$3'}>
                <RenderDriveFile
                  style={{
                    width: screen.sm ? '100%' : '64px',
                    height: screen.sm ? '120px' : '64px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                  file={orderItem.product.thumbnail}
                />

                <YStack
                  flex={1}
                  marginLeft='$2'
                  gap='$2'
                  width={screen.sm ? '100%' : 'auto'}
                >
                  <Text
                    marginBottom='$1'
                    marginLeft='$1'
                    onPress={() =>
                      router.push(
                        `/product-details/${orderItem.product._id}?name=${orderItem.product.name}&description=${orderItem.product.description}&variant=${orderItem.variant}`
                      )
                    }
                    hoverStyle={{
                      color: '$linkColor',
                      cursor: 'pointer',
                    }}
                    fontSize={screen.sm ? '$2' : '$3'}
                    fontWeight='500'
                    textAlign={screen.xs ? 'center' : 'left'}
                  >
                    {orderItem.product.name}
                  </Text>
                  <XStack
                    //  justifyContent='space-between'
                    flexWrap='wrap'
                    gap='$3'
                  >
                    <Text>
                      {orderItem.quantityOrdered} × {orderItem.finalUnitPrice}
                    </Text>
                    <Text fontWeight='bold'>
                      <PriceFormatter value={orderItem.finalUnitPrice} />
                    </Text>
                    <OrderStatusBadge status={orderItem.status} />
                  </XStack>
                </YStack>
              </XStack>
            </Card>
          ))}

          <Separator />

          <YStack space='$3'>
            <XStack justifyContent='space-between'>
              <Text>Subtotal</Text>
              <Text>
                <PriceFormatter
                  value={
                    item.totalAmount -
                    item.taxAmount -
                    item.deliveryCharge -
                    item.serviceCharge
                  }
                />
              </Text>
            </XStack>

            <XStack justifyContent='space-between'>
              <Text>Tax</Text>
              <Text>
                <PriceFormatter value={item.taxAmount} />
              </Text>
            </XStack>

            <XStack justifyContent='space-between'>
              <Text>Delivery Fee</Text>
              <Text>
                <PriceFormatter value={item.deliveryCharge} />
              </Text>
            </XStack>

            <XStack justifyContent='space-between'>
              <Text>Service Charge</Text>
              <Text>
                <PriceFormatter value={item.serviceCharge} />
              </Text>
            </XStack>

            <Separator />

            <XStack marginTop='$1' justifyContent='space-between'>
              <Text fontWeight='bold'>Total</Text>
              <Text fontWeight='bold'>
                <PriceFormatter value={item.totalAmount} />
              </Text>
            </XStack>
          </YStack>

          <Separator />

          <XStack
            justifyContent={screen.sm ? 'center' : 'space-between'}
            flexWrap='wrap'
            gap='$2'
            marginTop='$2'
          >
            <Button
              size={screen.sm ? '$2' : '$3'}
              icon={<FiTruck size={screen.sm ? 14 : 16} />}
              disabled={
                !['shipped', 'delivered'].includes((item as any)?.overallStatus)
              }
            >
              Track Order
            </Button>

            <Button
              size={screen.sm ? '$2' : '$3'}
              variant='outlined'
              color='$red10'
              disabled={
                !['pending', 'accepted'].includes((item as any).overallStatus)
              }
            >
              Cancel Order
            </Button>
          </XStack>
        </YStack>
      )}
    </Card>
  );
};

export default OrderItem;
