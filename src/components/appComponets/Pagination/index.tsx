'use client';

import React from 'react';
import { XStack, Text, Button, View } from 'tamagui';
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from 'react-icons/fa';
import AsyncSelect from '../select/AsyncSelect';

interface PaginationProps {
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeOptions?: boolean;
  showFirstLastButtons?: boolean;
  showPageInfo?: boolean;
  disabled?: boolean;
  compact?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  pageIndex,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeOptions = true,
  showFirstLastButtons = true,
  showPageInfo = true,
  disabled = false,
  compact = false,
}) => {
  const currentPage = pageIndex + 1;

  const startItem = totalCount === 0 ? 0 : pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalCount);

  const getPageNumbers = () => {
    const maxPageButtons = compact ? 3 : 5;
    const pages = [];

    let startPage = 1;
    let endPage = pageCount;

    if (pageCount > maxPageButtons) {
      const leftSidePages = Math.floor(maxPageButtons / 2);
      const rightSidePages = maxPageButtons - leftSidePages - 1;

      startPage = Math.max(1, currentPage - leftSidePages);
      endPage = Math.min(pageCount, currentPage + rightSidePages);

      if (startPage <= 1) {
        endPage = Math.min(startPage + maxPageButtons - 1, pageCount);
      }

      if (endPage >= pageCount) {
        startPage = Math.max(pageCount - maxPageButtons + 1, 1);
      }
    }

    if (startPage > 1) {
      pages.push('start-ellipsis');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i.toString());
    }

    if (endPage < pageCount) {
      pages.push('end-ellipsis');
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <XStack
      alignItems='center'
      justifyContent='space-between'
      flexWrap='wrap'
      gap={compact ? 4 : 8}
      width='100%'
    >
      <XStack alignItems='center' gap={8} />
      <XStack alignItems='center' gap={compact ? 4 : 8}>
        {showPageSizeOptions && (
          <XStack alignItems='center' gap={4}>
            <AsyncSelect
              marginBottom={0}
              width={100}
              value={pageSize.toString()}
              size='$3'
              options={pageSizeOptions.map((option) => ({
                value: option.toString(),
                label: option.toString(),
              }))}
              onChange={(value) => onPageSizeChange(parseInt(value, 10))}
            />
          </XStack>
        )}
        {showPageInfo && (
          <Text color='$gray11'>
            {startItem}-{endItem} of {totalCount}
          </Text>
        )}

        <XStack alignItems='center' gap={2}>
          {showFirstLastButtons && (
            <Button
              size='$3'
              icon={<FaAngleDoubleLeft size={16} />}
              disabled={currentPage <= 1 || disabled}
              onPress={() => onPageChange(1)}
              opacity={currentPage <= 1 ? 0.5 : 1}
              padding={compact ? 4 : 8}
            />
          )}

          <Button
            size='$3'
            icon={<FaChevronLeft size={16} />}
            disabled={currentPage <= 1 || disabled}
            onPress={() => onPageChange(currentPage - 1)}
            opacity={currentPage <= 1 ? 0.5 : 1}
            padding={compact ? 4 : 8}
          />

          {!compact && (
            <>
              {pageNumbers.map((page, index) => {
                if (page === 'start-ellipsis' || page === 'end-ellipsis') {
                  return (
                    <View key={`${page}-${index}`} paddingHorizontal={4}>
                      <Text>...</Text>
                    </View>
                  );
                }

                const pageNum = parseInt(page, 10);
                const isCurrentPage = pageNum === currentPage;

                return (
                  <Button
                    key={page}
                    size='$3'
                    disabled={disabled}
                    onPress={() => onPageChange(pageNum)}
                    padding={8}
                  >
                    {page}
                  </Button>
                );
              })}
            </>
          )}

          {compact && (
            <Text color='$gray11'>
              {currentPage} / {pageCount}
            </Text>
          )}

          <Button
            size='$3'
            icon={<FaChevronRight size={16} />}
            disabled={currentPage >= pageCount || disabled}
            onPress={() => onPageChange(currentPage + 1)}
            opacity={currentPage >= pageCount ? 0.5 : 1}
            padding={compact ? 4 : 8}
          />

          {showFirstLastButtons && (
            <Button
              size='$3'
              icon={<FaAngleDoubleRight size={16} />}
              disabled={currentPage >= pageCount || disabled}
              onPress={() => onPageChange(pageCount)}
              opacity={currentPage >= pageCount ? 0.5 : 1}
              padding={compact ? 4 : 8}
            />
          )}
        </XStack>
      </XStack>
    </XStack>
  );
};

export default Pagination;
