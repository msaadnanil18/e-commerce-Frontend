import { Tag } from '@/components/appComponets/tag/Tag';
import { FC } from 'react';
import { Text } from 'tamagui';

interface PaymentStatusBadgeProps {
  status: string;
}

const PaymentStatusBadge: FC<PaymentStatusBadgeProps> = ({ status }) => {
  let color = '';

  switch (status) {
    case 'paid':
      color = 'green';
      break;
    case 'partial':
      color = 'yellow';
      break;
    case 'pending':
      color = 'red';
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
    >
      <Text color='white' fontWeight='bold' textTransform='capitalize'>
        {status}
      </Text>
    </Tag>
  );
};

export default PaymentStatusBadge;
