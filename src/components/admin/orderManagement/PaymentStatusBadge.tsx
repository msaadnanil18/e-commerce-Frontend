'use client';

import { Tag } from '@/components/appComponets/tag/Tag';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'partial'
  | 'failed'
  | 'refunded';

const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
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
  let label = '';

  switch (status) {
    case 'pending':
      color = 'yellow';
      label = 'Pending';
      break;
    case 'paid':
      color = 'green';
      label = 'Paid';
      break;
    case 'partial':
      color = 'blue';
      label = 'Partial';
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
    >
      {label}
    </Tag>
  );
};

export default PaymentStatusBadge;
