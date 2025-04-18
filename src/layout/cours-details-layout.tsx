import { getOneLesson, getProgress } from '@/apis/lesson/query-slice';
import { CourseSidebar } from '@/components/course/course-sidebar';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useQueries } from '@tanstack/react-query';
import { BookText, Users2 } from 'lucide-react';
import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';

export default function CoursDetailsLayout() {
  const { setSousPages } = useBreadcrumb();
  const { coursId, matiereId } = useParams();
  // classes/:matiereId/cours
  const {
    '0': { data, isLoading },
    '1': { data: progress, isLoading: isLoadingProgress },
  } = useQueries({
    queries: [
      {
        queryKey: ['cours-details', coursId],
        queryFn: () => getOneLesson(coursId!),
        enabled: !!coursId,
      },
      {
        queryKey: ['user-progress', coursId],
        queryFn: () => getProgress(coursId!),
        enabled: !!coursId,
      },
    ],
  });
  useEffect(() => {
    setSousPages([
      { name: 'classes', link: '/dashboard/classes', icon: <Users2 size={16} /> },
      {
        name: 'cours',
        link: `classes/${matiereId}/cours`,
        icon: <BookText size={16} />,
      },
      { name: data?.title, link: 'cours-details', icon: <BookText size={16} /> },
    ]);
  }, [setSousPages, data?.title, matiereId]);
  return (
    <>
      {isLoading || isLoadingProgress ? (
        <div className="container mx-auto py-10 px-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Chargement...</h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex">
          <div className="hidden md:flex h-lvh w-80 flex-col inset-y-0">
            <CourseSidebar course={data} progressCount={progress?.progress || 0} />
          </div>
          <main className="container mx-auto py-10 px-10">
            <Outlet />
          </main>
        </div>
      )}
    </>
  );
}
