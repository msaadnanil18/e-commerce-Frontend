import { Tag } from '@/components/appComponets/tag/Tag';
import { FC } from 'react';
import { FiCheck, FiClock, FiPackage, FiTruck, FiX } from 'react-icons/fi';
import { XStack, Text } from 'tamagui';

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge: FC<OrderStatusBadgeProps> = ({ status }) => {
  let color = '';
  let icon = null;

  switch (status) {
    case 'pending':
      color = 'orange';
      icon = <FiClock size={14} />;
      break;
    case 'accepted':
      color = 'blue';
      icon = <FiCheck size={14} />;
      break;
    case 'shipped':
      color = 'purple';
      icon = <FiTruck size={14} />;
      break;
    case 'delivered':
      color = 'green';
      icon = <FiPackage size={14} />;
      break;
    case 'canceled':
    case 'rejected':
      color = 'red';
      icon = <FiX size={14} />;
      break;
    default:
      color = 'gray';
  }

  return (
    <Tag
      backgroundColor={`$${color}9`}
      style={{ height: 25, borderRadius: 5 }}
      width='$10'
      textProps={{
        fontSize: '$3.5',
        fontWeight: 'bold',
        textTransform: 'uppercase',
      }}
      borderRadius='$2'
      icon={icon}
    >
      <Text
        color='white'
        fontWeight='bold'
        textTransform='capitalize'
        margin={0}
        padding={0}
        paddingLeft={'$1'}
      >
        {status}
      </Text>
    </Tag>
  );
};

export default OrderStatusBadge;
