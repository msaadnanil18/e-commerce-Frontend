'use client';

import { debounce } from 'lodash-es';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';

interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  fetchFunction: (
    page: number,
    pageSize: number,
    ...args: any[]
  ) => Promise<any>;
  totalCountKey?: string;
  pageCountKey?: string;
  currentPageKey?: string;
  dataKey?: string;
  onError?: (error: any) => void;
}

interface PaginationState<T> {
  items: T[];
  loading: boolean;
  totalCount: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
  error: any | null;
}

interface PaginationHandlers {
  handlePageChange: (newPage: number) => void;
  handlePageSizeChange: (newPageSize: number) => void;
  fetchData: (...args: any[]) => Promise<void>;
  refresh: () => Promise<void>;
  handleOnSearch: (searchTerm: string, delay?: number) => void;
}

interface PaginationResult<T> {
  state: PaginationState<T>;
  action: PaginationHandlers;
  paginationProps: {
    pageCount: number;
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
}

export const usePagination = <T,>({
  initialPage = 1,
  initialPageSize = 20,
  fetchFunction,
  totalCountKey = 'totalDocs',
  pageCountKey = 'totalPages',
  currentPageKey = 'page',
  dataKey = 'docs',
  onError,
}: PaginationOptions): PaginationResult<T> => {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [error, setError] = useState<any | null>(null);
  const debounceRef = useRef<{ [key: number]: (s: string) => void }>({});

  const fetchData = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);

      const response = await fetchFunction(currentPage, pageSize, ...args);

      const data = response.data || response;
      const items = data[dataKey] || [];

      setItems(items);
      setTotalCount(data[totalCountKey] || 0);
      setPageCount(data[pageCountKey] || 1);
      setCurrentPage(data[currentPageKey] || currentPage);
      setLoading(false);
      return data;
    },
    [
      currentPage,
      pageSize,
      fetchFunction,
      dataKey,
      totalCountKey,
      pageCountKey,
      currentPageKey,
      onError,
    ]
  );

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  const refresh = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, fetchData]);

  const handleOnSearch = useCallback(
    (searchTerm: string, delay = 350) => {
      if (!debounceRef.current[delay]) {
        debounceRef.current[delay] = debounce((s: string) => {
          fetchData(s);
        }, delay);
      }

      debounceRef.current[delay](searchTerm);
    },
    [fetchData]
  );

  const state = useMemo(
    () => ({
      items,
      loading,
      totalCount,
      pageCount,
      currentPage,
      pageSize,
      error,
    }),
    [items, loading, totalCount, pageCount, currentPage, pageSize, error]
  );

  const action = useMemo(
    () => ({
      handlePageChange,
      handlePageSizeChange,
      fetchData,
      refresh,
      handleOnSearch,
      setItems,
    }),
    [
      handlePageChange,
      handlePageSizeChange,
      fetchData,
      refresh,
      setItems,
      handleOnSearch,
    ]
  );
  return {
    state,
    action,
    paginationProps: {
      pageCount,
      pageIndex: currentPage - 1,
      pageSize,
      totalCount,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
    },
  };
};
