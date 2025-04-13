import { useMemo, useState } from "react";

interface UsePaginationProps {
  initialItemsPerPage?: number;
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
}

export function usePagination({
  initialItemsPerPage = 6,
  totalItems = 0,
  totalPages = 1,
  currentPage: initialPage = 1,
}: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const pageInfo = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(totalItems, startIndex + itemsPerPage);
    return {
      startIndex: totalItems > 0 ? startIndex + 1 : 0,
      endIndex,
      totalItems,
    };
  }, [totalItems, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changeItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    pageInfo,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changeItemsPerPage,
  };
}
