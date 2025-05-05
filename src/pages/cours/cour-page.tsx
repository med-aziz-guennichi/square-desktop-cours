// src/pages/CourPage.tsx
import { CourseCard } from '@/components/cards/subject-card';
import { NoDataFound } from '@/components/no-data-found';
import SubjectCardSketlon from '@/components/sketlon/subject-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { cardVariants } from '@/constants/animations';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useScreenWidth } from '@/hooks/screen-size';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/user-store';
import { Cours } from '@/types/cours.interface';
import { AnimatePresence, motion } from 'framer-motion';
import { Book, BookText, Lock, Search, Users2 } from 'lucide-react';
import { useEffect } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useFilteredLessons } from './hooks/use-filtered-lessons';

export default function CourPage() {
  const { matiereId } = useParams();
  const { setSousPages } = useBreadcrumb();
  const user = useUserStore().decodedUser;
  const width = useScreenWidth();
  const isMediumScreen = width >= 769 && width <= 1434;
  const navigate = useNavigate();

  const { data, isLoading, filters, setFilters, page, setPage } = useFilteredLessons(
    matiereId || '',
    {
      sortField: 'createdAt',
      sortOrder: 'desc',
    },
  );

  useEffect(() => {
    function updateBreadcrumbs() {
      if (matiereId === 'cours-partager') {
        setSousPages([
          {
            name: 'cours-partager',
            link: () => navigate(-1),
            icon: <Users2 size={16} />,
          },
        ]);
      } else {
        setSousPages([
          {
            name: 'classes',
            link: '/dashboard/classes',
            icon: <Users2 size={16} />,
          },
          { name: 'matieres', link: () => navigate(-1), icon: <Book size={16} /> },
          { name: 'cours', link: '/cours', icon: <BookText size={16} /> },
        ]);
      }
    }
    updateBreadcrumbs();
  }, [setSousPages, navigate, matiereId]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
    setPage(1); // Reset to first page when searching
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('_');
    setFilters((prev) => ({
      ...prev,
      sortField: field,
      sortOrder: order as 'asc' | 'desc',
    }));
  };

  const handleLockedToggle = (pressed: boolean) => {
    setFilters((prev) => ({ ...prev, isLocked: pressed ? true : undefined }));
  };
  return (
    <div className="container mx-auto py-10 px-4 md:px-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Liste des Cours</h1>
          <sub className="font-bold text-gray-600">
            {data?.total || 0} cours disponibles
          </sub>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un cours..."
              className="pl-10"
              value={filters.search || ''}
              onChange={handleSearch}
            />
          </div>

          <Select onValueChange={handleSortChange}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt_desc">Plus récent</SelectItem>
              <SelectItem value="createdAt_asc">Plus ancien</SelectItem>
              <SelectItem value="title_asc">A-Z</SelectItem>
              <SelectItem value="title_desc">Z-A</SelectItem>
            </SelectContent>
          </Select>

          {user?.role !== 'student' && (
            <Toggle
              pressed={filters.isLocked === true}
              onPressedChange={handleLockedToggle}
              aria-label="Filtrer par verrouillage"
              className="px-4"
            >
              <Lock className="h-4 w-4 mr-2" />
              Verrouillés
            </Toggle>
          )}

          {user?.role !== 'student' && (
            <Button asChild className="w-full md:w-auto">
              <NavLink to={`ajouter-cours`}>Ajouter cours</NavLink>
            </Button>
          )}
        </div>
      </div>

      <div
        className={cn(
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
          isMediumScreen && 'grid-cols-1 p-3',
        )}
      >
        <AnimatePresence mode="popLayout">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={cardVariants}
                  transition={{ duration: 0.3 }}
                >
                  <SubjectCardSketlon />
                </motion.div>
              ))
            : data?.data?.map((cours: Cours) => (
                <motion.div
                  key={cours._id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={cardVariants}
                  transition={{ duration: 0.3 }}
                >
                  <CourseCard
                    id={cours?._id}
                    title={cours?.title}
                    instructor={{
                      name: cours?.creator?.firstName || 'Unknown',
                      surname: cours?.creator?.lastName || 'Unknown',
                      avatar: `${import.meta.env.VITE_API_BASE_URL}/${cours?.creator?.imageUrl}`,
                    }}
                    badge={cours.isLocked ? 'Verrouillé' : 'Cours'}
                    description={cours?.description}
                    onClick={(id) => {
                      if (cours.creator._id === user?._id) {
                        navigate(`modifier-cours/${id}`);
                      } else {
                        navigate(`cours/${id}`);
                      }
                    }}
                    chapters={cours?.chapters.length || 0}
                    subjectId={matiereId}
                    isLocked={cours.isLocked}
                  />
                </motion.div>
              ))}
        </AnimatePresence>
      </div>
      {data?.data?.length === 0 && (
        <NoDataFound
          title="No results found"
          description="Try adjusting your search or filter criteria to find what you're looking for."
        />
      )}

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-disabled={page === 1}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, data.pagination.totalPages) }).map(
                (_, i) => {
                  let pageNum;
                  if (data.pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= data.pagination.totalPages - 2) {
                    pageNum = data.pagination.totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={pageNum === page}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                },
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((p) => Math.min(data.pagination.totalPages, p + 1))
                  }
                  aria-disabled={page === data.pagination.totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
