import { useState } from 'react';

export const usePagination = (initialPage = 1, initialSize = 10) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);
  return { page, setPage, pageSize, setPageSize };
};
