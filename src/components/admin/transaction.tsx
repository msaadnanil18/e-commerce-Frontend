'use client';

import { ReactElement, useState } from 'react';
import { Column } from 'react-table';
import TableHOC from './organism/TableHOC';
import AdminSidebar from './organism/AdminSidebar';
import { useRouter } from 'next/navigation';
import { Button } from 'tamagui';
import { RiEdit2Fill } from 'react-icons/ri';

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: 'Avatar',
    accessor: 'user',
  },
  {
    Header: 'Amount',
    accessor: 'amount',
  },
  {
    Header: 'Discount',
    accessor: 'discount',
  },
  {
    Header: 'Quantity',
    accessor: 'quantity',
  },
  {
    Header: 'Status',
    accessor: 'status',
  },
  {
    Header: 'Action',
    accessor: 'action',
  },
];

const Transaction = () => {
  const router = useRouter();
  const arr: Array<DataType> = [
    {
      user: 'Charas',
      amount: 4500,
      discount: 400,
      status: <span className='red'>Processing</span>,
      quantity: 3,
      action: (
        <Button
          icon={<RiEdit2Fill />}
          chromeless
          onPress={() => router.push('/admin/transaction/sajknaskd')}
        />
      ),
    },

    {
      user: 'Xavirors',
      amount: 6999,
      discount: 400,
      status: <span className='green'>Shipped</span>,
      quantity: 6,
      action: (
        <Button
          icon={<RiEdit2Fill />}
          chromeless
          onPress={() => router.push('/admin/transaction/sajknaskd')}
        />
      ),
    },
    {
      user: 'Xavirors',
      amount: 6999,
      discount: 400,
      status: <span className='purple'>Delivered</span>,
      quantity: 6,
      action: (
        <Button
          icon={<RiEdit2Fill />}
          chromeless
          onPress={() => router.push('/admin/transaction/sajknaskd')}
        />
      ),
    },
  ];
  const [rows, setRows] = useState<DataType[]>(arr);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    'dashboard-product-box',
    'Transactions',
    rows.length > 6
  )();
  return (
    <div className='admin-container'>
      <AdminSidebar />
      <main>{Table}</main>
    </div>
  );
};

export default Transaction;
