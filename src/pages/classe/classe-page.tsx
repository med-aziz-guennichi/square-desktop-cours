import { getClasses } from '@/apis/classes/query-slice';
import ClassCardSkeleton from '@/components/sketlon/classe-card';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useScreenWidth } from '@/hooks/screen-size';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/user-store';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Users2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';

import { ClassCard } from '@/components/cards/classe-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cardVariants } from '@/constants/animations';
import { SubjectsInstructor } from '@/types/classe.interface';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { ClassFilterPanel } from './components/class-filter-panel';
import { EmptyResults } from './components/empty-results';
import { PaginationControls } from './components/pagination-controls';
import { useClassFilters } from './hooks/use-filter';
import { usePagination } from './hooks/use-pagination';

interface ClassData {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  students: Array<{ gender: string }>;
  subjects_instructors: SubjectsInstructor[];
  countLessons: number;
}
export default function ClassePage() {
  const user = useUserStore.getState().decodedUser;
  const id = user?.facility?.scholarityConfigId;
  const width = useScreenWidth();
  const isMediumScreen = width >= 769 && width <= 1434;
  const isMobile = useIsMobile();
  const { setSousPages } = useBreadcrumb();

  const {
    currentPage,
    itemsPerPage,
    pageInfo,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changeItemsPerPage,
  } = usePagination({
    initialItemsPerPage: 6,
  });

  const {
    filters: activeFilters,
    updateFilter,
    removeFilter,
    clearAllFilters,
  } = useClassFilters();

  const {
    data: classes,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ['classes', id, currentPage, itemsPerPage, activeFilters],
    queryFn: () => getClasses(id!, currentPage, itemsPerPage, activeFilters),
    enabled: !!id,
    placeholderData: keepPreviousData,
  });

  // Extract unique subjects and instructors for filters
  const availableSubjects = useMemo(() => {
    if (!classes?.data) return [];
    const subjects = new Map();
    classes.data.forEach((classe: ClassData) => {
      classe.subjects_instructors?.forEach((si) => {
        if (si.subject && !subjects.has(si.subject)) {
          subjects.set(si.subject, si.subject);
        }
      });
    });
    return Array.from(subjects.values());
  }, [classes?.data]);

  const availableInstructors = useMemo(() => {
    if (!classes?.data) return [];
    const instructors = new Map();
    classes.data.forEach((classe: ClassData) => {
      classe.subjects_instructors?.forEach((si) => {
        if (si.instructor && !instructors.has(si.instructor._id)) {
          instructors.set(si.instructor._id, si.instructor);
        }
      });
    });
    return Array.from(instructors.values());
  }, [classes?.data]);

  // Reset to first page when filters change
  useEffect(() => {
    goToPage(1);
  }, [activeFilters, goToPage]);

  // Update pagination with backend data when available
  useEffect(() => {
    if (classes) {
      goToPage(classes.currentPage);
    }
  }, [classes?.currentPage, classes, goToPage]);

  if (isError) {
    toast.error('Something went wrong');
  }

  useEffect(() => {
    setSousPages([
      { name: 'classes', link: '/dashboard/classes', icon: <Users2 size={16} /> },
    ]);
  }, [setSousPages]);

  return (
    <main className="container mx-auto py-10 px-10">
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
        filters={activeFilters}
        activeFilters={activeFilters}
        updateFilter={updateFilter}
        removeFilter={removeFilter}
        clearAllFilters={clearAllFilters}
        subjects={availableSubjects}
        instructors={availableInstructors}
      />

      {/* Results count */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {pageInfo.startIndex}-{pageInfo.endIndex} of{' '}
          {classes?.totalItems || 0} classes
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
          {isLoading || isFetching ? (
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
              {classes?.data?.length > 0 ? (
                classes.data.map((classe: ClassData) => (
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
      {!isLoading && classes?.data?.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={classes.totalPages}
          goToPage={goToPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
        />
      )}
    </main>
  );
}
