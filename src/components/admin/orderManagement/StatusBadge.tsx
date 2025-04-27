'use client';

import { Tag } from '@/components/appComponets/tag/Tag';
import { FiTruck, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'shipped'
  | 'canceled'
  | 'delivered';

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  let color:
    | 'orange'
    | 'blue'
    | 'red'
    | 'purple'
    | 'green'
    | 'yellow'
    | 'gray'
    | 'teal'
    | undefined = undefined;
  let Icon = FiClock;
  let label = '';

  switch (status) {
    case 'pending':
      color = 'orange';
      Icon = FiClock;
      label = 'Pending';
      break;
    case 'accepted':
      color = 'blue';
      Icon = FiCheckCircle;
      label = 'Accepted';
      break;
    case 'rejected':
      color = 'red';
      Icon = FiXCircle;
      label = 'Rejected';
      break;
    case 'shipped':
      color = 'purple';
      Icon = FiTruck;
      label = 'Shipped';
      break;
    case 'delivered':
      color = 'green';
      Icon = FiCheckCircle;
      label = 'Delivered';
      break;
    case 'canceled':
      color = 'red';
      Icon = FiXCircle;
      label = 'Cancelled';
      break;
  }

  return (
    <Tag
      colorScheme={color}
      width='$10'
      textProps={{
        fontSize: '$3',
        textTransform: 'uppercase',
        borderRadius: 0,
      }}
      style={{ borderRadius: 2, height: 20 }}
      icon={<Icon size={14} />}
    >
      {label}
    </Tag>
  );
};

export default StatusBadge;
