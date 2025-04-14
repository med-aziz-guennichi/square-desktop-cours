import { getLessons } from '@/apis/lesson/query-slice';
import { CourseCard } from '@/components/cards/subject-card';
import SubjectCardSketlon from '@/components/sketlon/subject-card';
import { Button } from '@/components/ui/button';
import { cardVariants } from '@/constants/animations';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useScreenWidth } from '@/hooks/screen-size';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Cours } from '@/types/cours.interface';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Book, BookText, Users2 } from 'lucide-react';
import { useEffect } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

export default function CourPage() {
  const { setSousPages } = useBreadcrumb();
  const { matiereId } = useParams();
  const width = useScreenWidth();
  const isMediumScreen = width >= 769 && width <= 1434;
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['cours', matiereId],
    queryFn: () => getLessons(matiereId!),
    enabled: !!matiereId,
  });
  useEffect(() => {
    setSousPages([
      { name: 'classes', link: '/dashboard/classes', icon: <Users2 size={16} /> },
      { name: 'matieres', link: () => navigate(-1), icon: <Book size={16} /> },
      { name: 'cours', link: '/cours', icon: <BookText size={16} /> },
    ]);
  }, [setSousPages, navigate]);
  return (
    <div className="container mx-auto py-10 px-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Liste des Cours</h1>
          <sub className="font-bold text-gray-600">
            {data?.data?.length} cours disponibles
          </sub>
        </div>
        <Button asChild>
          <NavLink to={`ajouter-cours`}>
            Ajouter cours
          </NavLink>
        </Button>
      </div>

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
              {[0, 1, 2, 3, 4, 5, 6].map((_, i) => (
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
              ))}
            </>
          ) : (
            <>
              {data?.data?.map((cours: Cours) => (
                <motion.div
                  key={cours._id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={cardVariants}
                  transition={{ duration: 0.3 }}
                >
                  <CourseCard
                    key={cours?._id}
                    id={cours?._id}
                    title={cours?.title}
                    instructor={{
                      name: cours?.instructorId?.firstName || 'Unknown',
                      surname: cours?.instructorId?.lastName || 'Unknown',
                      avatar: `${import.meta.env.VITE_API_BASE_URL}/${cours?.instructorId?.imageUrl}`,
                    }}
                    isCourse={true}
                    description={cours?.description}
                    onShareClick={(id) => console.warn(`Partager le cours ${id}`)}
                    onClick={(id) => console.warn(id)}
                  />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
