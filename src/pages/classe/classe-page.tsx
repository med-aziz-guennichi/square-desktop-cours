import { getClasses } from '@/apis/classes/query-slice';
import ClassCardSkeleton from '@/components/sketlon/classe-card';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useScreenWidth } from '@/hooks/screen-size';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/user-store';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Users2 } from 'lucide-react';
import { useEffect } from 'react';

import { ClassCard } from '@/components/cards/classe-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cardVariants } from '@/constants/animations';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { ClassFilterPanel } from './components/class-filter-panel';
import { EmptyResults } from './components/empty-results';
import { PaginationControls } from './components/pagination-controls';
import { useClassFilters } from './hooks/use-filter';
import { usePagination } from './hooks/use-pagination';

export default function ClassePage() {
  const user = useUserStore.getState().decodedUser;
  const id = user?.facility?.scholarityConfigId;
  const width = useScreenWidth();
  const isMediumScreen = width >= 769 && width <= 1434;
  const isMobile = useIsMobile();
  const { setSousPages } = useBreadcrumb();

  const {
    data: classes,
    isLoading,
    isError,
    // isFetching, // this for the pagination fetching
  } = useQuery({
    queryKey: ['classes', id],
    queryFn: () => getClasses(id!),
    enabled: !!id,
    placeholderData: keepPreviousData,
  });

  if (isError) {
    toast.error('Something went wrong');
  }

  useEffect(() => {
    setSousPages([
      { name: 'classes', link: '/dashboard/classes', icon: <Users2 size={16} /> },
    ]);
  }, [setSousPages]);

  // Use our custom hooks
  const {
    filters,
    activeFilters,
    filteredClasses,
    updateFilter,
    removeFilter,
    clearAllFilters,
  } = useClassFilters(classes);

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedData: paginatedClasses,
    pageInfo,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changeItemsPerPage,
  } = usePagination({
    data: filteredClasses,
    initialItemsPerPage: 6,
  });

  return (
    <main className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">Informations des Classes</h1>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => changeItemsPerPage(Number(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 per page</SelectItem>
              <SelectItem value="6">6 per page</SelectItem>
              <SelectItem value="9">9 per page</SelectItem>
              <SelectItem value="12">12 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters */}
      <ClassFilterPanel
        filters={filters}
        activeFilters={activeFilters}
        updateFilter={updateFilter}
        removeFilter={removeFilter}
        clearAllFilters={clearAllFilters}
      />

      {/* Results count */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {pageInfo.startIndex}-{pageInfo.endIndex} of {pageInfo.totalItems}{' '}
          classes
        </p>
      </div>

      {/* Classes Grid */}
      <div
        className={cn(
          'grid grid-cols-3 gap-6',
          isMediumScreen && 'grid-cols-1 p-3',
          isMobile && 'grid-cols-1',
        )}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <>
              {[0, 1, 2, 3, 4, 5].map((_, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={cardVariants}
                  transition={{ duration: 0.3 }}
                >
                  <ClassCardSkeleton />
                </motion.div>
              ))}
            </>
          ) : (
            <>
              {paginatedClasses.length > 0 ? (
                paginatedClasses.map((classe) => (
                  <motion.div
                    key={classe?._id}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={cardVariants}
                    transition={{ duration: 0.3 }}
                  >
                    <ClassCard
                      key={classe?._id}
                      id={classe._id}
                      coursesCount={classe?.countLessons}
                      instructors={classe.subjects_instructors.map(
                        (subjects_instructor) => {
                          return {
                            id: subjects_instructor.instructor?._id,
                            name:
                              subjects_instructor.instructor?.firstName || 'Unknown',
                            surname:
                              subjects_instructor.instructor?.lastName || 'Unknown',
                            avatar: `${import.meta.env.VITE_API_BASE_URL}/${subjects_instructor.instructor?.imageUrl}`,
                          };
                        },
                      )}
                      period={{
                        start: classe?.startDate,
                        end: classe?.endDate,
                      }}
                      students={{
                        genderDistribution: {
                          male: classe?.students?.filter(
                            (std) => std?.gender === 'homme',
                          ).length,
                          female: classe?.students?.filter(
                            (std) => std?.gender === 'femme',
                          ).length,
                        },
                        total: classe?.students?.length,
                      }}
                      title={classe?.name}
                      onChatClick={() => console.warn('Chat clicked')}
                      onEditClick={(id) => console.warn('Edit clicked for', id)}
                      onDeleteClick={(id) => console.warn('Delete clicked for', id)}
                    />
                  </motion.div>
                ))
              ) : (
                <EmptyResults clearAllFilters={clearAllFilters} />
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {!isLoading && filteredClasses.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
        />
      )}
    </main>
  );
}
