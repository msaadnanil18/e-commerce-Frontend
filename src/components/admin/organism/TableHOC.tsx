'use client';

import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from 'react-icons/ai';
import { NewTableHOC } from './NewTableHOC';
import React, { useState, useEffect } from 'react';
import {
  useGlobalFilter,
  useRowSelect,
  Row,
  SortingRule,
  Column,
  usePagination,
  useSortBy,
  useTable,
  TableOptions,
} from 'react-table';
import { twMerge } from 'tailwind-merge';
import { FiChevronDown, FiChevronUp, FiFilter } from 'react-icons/fi';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { BsSearch } from 'react-icons/bs';

interface ServerSidePaginationProps {
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

interface ServerSideSortingProps {
  onSortChange: (sortBy: SortingRule<object>[]) => void;
}

interface TableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  pagination?: boolean;
  filtering?: boolean;
  getVariantClasses?: string;
  selection?: boolean;
  pageSize?: number;
  className?: string;
  onSearch?: (r: string) => void;
  isDark?: boolean;
  variant?: 'default' | 'striped' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
  emptyMessage?: string;
  onRowClick?: (row: Row<T>) => void;
  serverSidePagination?: ServerSidePaginationProps;
  serverSideSorting?: ServerSideSortingProps;
}

// Checkbox component for row selection
const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }: any, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate;
      }
    }, [resolvedRef, indeterminate]);

    return (
      <input
        type='checkbox'
        ref={resolvedRef}
        className='w-4 h-4 rounded '
        {...rest}
      />
    );
  }
);

IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';

export { NewTableHOC };
// export function NewTableHOC<T extends object>({
//   columns,
//   data,
//   title,
//   pagination = true,
//   filtering = true,
//   selection = false,
//   pageSize = 10,
//   className = '',
//   variant = 'default',
//   size = 'md',
//   emptyMessage = 'No data available',
//   onRowClick,
//   serverSidePagination,
//   serverSideSorting,
//   isDark = false,
//   getVariantClasses,
//   onSearch,
// }: TableProps<T>) {
//   const [filterInput, setFilterInput] = useState('');

//   // Use server-side pagination values if provided
//   const initialState = {
//     pageSize: serverSidePagination?.pageSize || pageSize,
//     pageIndex: serverSidePagination?.pageIndex || 0,
//   };

//   const tableOptions: TableOptions<T> = {
//     columns,
//     data,
//     initialState,
//     manualPagination: !!serverSidePagination,
//     manualSortBy: !!serverSideSorting,
//     pageCount: serverSidePagination?.pageCount || -1,
//     disableMultiSort: true,
//   };

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     prepareRow,
//     page,
//     canPreviousPage,
//     canNextPage,
//     pageCount,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize,
//     setGlobalFilter,
//     state: {
//       pageIndex,
//       pageSize: currentPageSize,
//       globalFilter,
//       selectedRowIds,
//       sortBy,
//     },
//     selectedFlatRows,
//   } = useTable(
//     tableOptions,
//     useGlobalFilter,
//     useSortBy,
//     usePagination,
//     useRowSelect,
//     (hooks) => {
//       if (selection) {
//         hooks.visibleColumns.push((columns) => [
//           {
//             id: 'selection',
//             Header: ({ getToggleAllPageRowsSelectedProps }) => (
//               <div>
//                 <IndeterminateCheckbox
//                   {...getToggleAllPageRowsSelectedProps()}
//                 />
//               </div>
//             ),
//             Cell: ({ row }) => (
//               <div onClick={(e) => e.stopPropagation()}>
//                 <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
//               </div>
//             ),
//           },
//           ...columns,
//         ]);
//       }
//     }
//   );

//   useEffect(() => {
//     if (serverSidePagination && !serverSideSorting) {
//       serverSidePagination.onPageChange(pageIndex + 1);
//     }
//   }, [pageIndex, serverSidePagination]);

//   useEffect(() => {
//     if (serverSidePagination) {
//       serverSidePagination.onPageSizeChange(currentPageSize);
//     }
//   }, [currentPageSize, serverSidePagination]);

//   useEffect(() => {
//     if (serverSideSorting && sortBy.length > 0) {
//       serverSideSorting.onSortChange(sortBy);
//     }
//   }, [sortBy, serverSideSorting]);

//   const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value || '';
//     setFilterInput(value);
//     // setGlobalFilter(value);
//     if (onSearch) onSearch(value);
//   };

//   const getSizeClasses = () => {
//     switch (size) {
//       case 'sm':
//         return 'text-xs p-1 md:p-2';
//       case 'lg':
//         return 'text-base p-4 md:p-5';
//       default:
//         return 'text-sm p-2 md:p-3';
//     }
//   };

//   return (
//     <div className={twMerge(`w-full overflow-hidden`, className)}>
//       <div className='px-4 py-3  flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2'>
//         {title && <h3 className='text-lg font-semibold'>{title}</h3>}

//         {filtering && (
//           <div className='relative flex items-center'>
//             <BsSearch className='absolute left-3 text-gray-400' />
//             <input
//               type='text'
//               value={filterInput}
//               onChange={handleFilterChange}
//               placeholder='Search...'
//               className={`pl-9 pr-4 py-2 w-full sm:w-64 text-sm border rounded-md focus:outline-none focus:ring-2 ${
//                 isDark ? 'bg-darkBg' : ' bg-ligthBg'
//               } `}
//             />
//           </div>
//         )}
//       </div>

//       <div className='overflow-x-auto'>
//         <table
//           {...getTableProps()}
//           className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'
//         >
//           <thead>
//             {headerGroups.map((headerGroup, index) => (
//               <tr
//                 {...headerGroup.getHeaderGroupProps()}
//                 key={headerGroup.id || index}
//               >
//                 {headerGroup.headers.map((column) => (
//                   <th
//                     {...column.getHeaderProps(column.getSortByToggleProps())}
//                     className={`font-medium  ${getSizeClasses()} text-left ${
//                       column.canSort ? 'cursor-pointer' : ''
//                     }`}
//                     key={column.id}
//                   >
//                     <div className='flex items-center gap-1'>
//                       {column.render('Header')}
//                       <span>
//                         {column.isSorted ? (
//                           column.isSortedDesc ? (
//                             <FiChevronDown className='ml-1' />
//                           ) : (
//                             <FiChevronUp className='ml-1 ' />
//                           )
//                         ) : column.canSort ? (
//                           <FiFilter className='ml-1 ' />
//                         ) : null}
//                       </span>
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody {...getTableBodyProps()} className='divide-y '>
//             {page.length > 0 ? (
//               page.map((row) => {
//                 prepareRow(row);
//                 return (
//                   <tr
//                     {...row.getRowProps()}
//                     key={row.id}
//                     className={twMerge(
//                       `${onRowClick ? 'cursor-pointer' : ''}`,
//                       getVariantClasses
//                     )}
//                     onClick={() => onRowClick && onRowClick(row)}
//                   >
//                     {row.cells.map((cell) => (
//                       <td
//                         {...cell.getCellProps()}
//                         className={`whitespace-nowrap  ${getSizeClasses()}`}
//                         key={cell.column.id}
//                       >
//                         {cell.render('Cell')}
//                       </td>
//                     ))}
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td
//                   colSpan={columns.length + (selection ? 1 : 0)}
//                   className='text-center py-6 '
//                 >
//                   {emptyMessage}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {pagination && (pageCount > 0 || serverSidePagination) && (
//         <div className='px-4 py-3 border-t  flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2'>
//           <div className='text-sm '>
//             {serverSidePagination ? (
//               <>
//                 Showing{' '}
//                 {serverSidePagination.totalCount > 0
//                   ? serverSidePagination.pageIndex *
//                       serverSidePagination.pageSize +
//                     1
//                   : 0}{' '}
//                 to{' '}
//                 {Math.min(
//                   (serverSidePagination.pageIndex + 1) *
//                     serverSidePagination.pageSize,
//                   serverSidePagination.totalCount
//                 )}{' '}
//                 of {serverSidePagination.totalCount} entries
//               </>
//             ) : (
//               <>
//                 Showing {page.length > 0 ? pageIndex * currentPageSize + 1 : 0}{' '}
//                 to {Math.min((pageIndex + 1) * currentPageSize, data.length)} of{' '}
//                 {data.length} entries
//               </>
//             )}
//           </div>

//           <div className='flex items-center gap-2'>
//             <div className='flex items-center'>
//               <select
//                 className={`mr-2 text-sm border rounded-md p-1 focus:outline-none focus:ring-2 ${
//                   isDark ? 'bg-darkBg' : ' bg-ligthBg'
//                 } `}
//                 value={currentPageSize}
//                 onChange={(e) => setPageSize(Number(e.target.value))}
//               >
//                 {[5, 10, 20, 50].map((size) => (
//                   <option key={size} value={size}>
//                     {size} rows
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className='flex items-center'>
//               <button
//                 onClick={() => gotoPage(0)}
//                 disabled={!canPreviousPage}
//                 className='p-1 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed'
//               >
//                 {'<<'}
//               </button>
//               <button
//                 onClick={() => previousPage()}
//                 disabled={!canPreviousPage}
//                 className='p-1 rounded-md border  ml-2 disabled:opacity-50 disabled:cursor-not-allowed'
//               >
//                 <HiOutlineChevronLeft />
//               </button>
//               <span className='mx-2 text-sm '>
//                 Page {pageIndex + 1} of{' '}
//                 {serverSidePagination
//                   ? serverSidePagination.pageCount
//                   : pageCount}
//               </span>
//               <button
//                 onClick={() => nextPage()}
//                 disabled={!canNextPage}
//                 className='p-1 rounded-md border mr-2 disabled:opacity-50 disabled:cursor-not-allowed'
//               >
//                 <HiOutlineChevronRight />
//               </button>
//               <button
//                 onClick={() =>
//                   gotoPage(
//                     (serverSidePagination
//                       ? serverSidePagination.pageCount
//                       : pageCount) - 1
//                   )
//                 }
//                 disabled={!canNextPage}
//                 className='p-1 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed'
//               >
//                 {'>>'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// old table hoc

function TableHOC<T extends Object>(
  columns: Column<T>[],
  data: T[],
  containerClassname: string,
  heading: string,
  showPagination: boolean = false
) {
  return function HOC() {
    const options: TableOptions<T> = {
      columns,
      data,
      initialState: {
        pageSize: 6,
      },
    };

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      prepareRow,
      nextPage,
      pageCount,
      state: { pageIndex },
      previousPage,
      canNextPage,
      canPreviousPage,
    } = useTable(options, useSortBy, usePagination);

    return (
      <div className={containerClassname}>
        <h2 className='heading'>{heading}</h2>

        <table className='table ' {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    {column?.isSorted && (
                      <span>
                        {' '}
                        {column?.isSortedDesc ? (
                          <AiOutlineSortDescending />
                        ) : (
                          <AiOutlineSortAscending />
                        )}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);

              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {showPagination && (
          <div className='table-pagination'>
            <button disabled={!canPreviousPage} onClick={previousPage}>
              Prev
            </button>
            <span>{`${pageIndex + 1} of ${pageCount}`}</span>
            <button disabled={!canNextPage} onClick={nextPage}>
              Next
            </button>
          </div>
        )}
      </div>
    );
  };
}

export default TableHOC;
