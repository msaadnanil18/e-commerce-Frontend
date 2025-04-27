'use client';

import { Column } from 'react-table';
import TableHOC from './TableHOC';
import { useDarkMode } from '@/hook/useDarkMode';

interface DataType {
  _id: string;
  quantity: number;
  discount: number;
  amount: number;
  status: string;
}

const columns: Column<DataType>[] = [
  {
    Header: 'Id',
    accessor: '_id',
  },
  {
    Header: 'Quantity',
    accessor: 'quantity',
  },
  {
    Header: 'Discount',
    accessor: 'discount',
  },
  {
    Header: 'Amount',
    accessor: 'amount',
  },
  {
    Header: 'Status',
    accessor: 'status',
  },
];

const DashboardTable = ({ data = [] }: { data: any[] }) => {
  const isDark = useDarkMode();
  return TableHOC<DataType>(
    columns,
    data,
    `transaction-box  ${isDark ? ' bg-darkBg' : ' bg-ligthBg'}`,
    'Top Transaction'
  )();
};

export default DashboardTable;
