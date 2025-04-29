import { getLessons } from '@/apis/lesson/query-slice';
import { useDebounce } from '@/hooks/use-debounce';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

type LessonFilters = {
  search?: string;
  isLocked?: boolean;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
};

export const useFilteredLessons = (
  matiereId: string,
  initialFilters: LessonFilters = {},
) => {
  const [filters, setFilters] = useState<LessonFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Debounce search to avoid too many requests
  const debouncedSearch = useDebounce(filters.search, 300);

  const queryKey = useMemo(
    () => [
      'cours',
      matiereId,
      { ...filters, search: debouncedSearch },
      page,
      pageSize,
    ],
    [matiereId, filters, debouncedSearch, page, pageSize],
  );

  const queryFn = async () => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.append('search', debouncedSearch);
    if (filters.isLocked !== undefined)
      params.append('isLocked', String(filters.isLocked));
    if (filters.sortField) params.append('sort', filters.sortField);
    if (filters.sortOrder) params.append('order', filters.sortOrder);

    params.append('page', String(page));
    params.append('limit', String(pageSize));

    return getLessons(matiereId, params.toString());
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    enabled: !!matiereId,
    placeholderData: keepPreviousData,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    filters,
    setFilters,
    page,
    setPage,
    pageSize,
    setPageSize,
  };
};
