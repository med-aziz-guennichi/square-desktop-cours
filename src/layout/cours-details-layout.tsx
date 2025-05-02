import { getOneLesson, getProgress } from '@/apis/lesson/query-slice';
import { CourseSidebar } from '@/components/course/course-sidebar';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { Progress } from '@/types/cours.interface';
import { useQueries } from '@tanstack/react-query';
import { BookText, Users2 } from 'lucide-react';
import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

export default function CoursDetailsLayout() {
  const { setSousPages } = useBreadcrumb();
  const { coursId, matiereId, chapitreId } = useParams();
  const navigate = useNavigate();

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
    if (!isLoading && !isLoadingProgress && data && !chapitreId) {
      // Find the last completed chapter
      const chapters = data.chapters || [];
      const sortedChapters = [...chapters].sort((a, b) => a.position - b.position);

      let lastCompletedIndex = -1;

      for (let i = 0; i < sortedChapters.length; i++) {
        const chapter = sortedChapters[i];
        const isComplete = chapter.userProgress?.some(
          (up: Progress) => up.isComplete,
        );
        if (isComplete) {
          lastCompletedIndex = i;
        } else {
          break; // Stop at the first incomplete chapter after completed ones
        }
      }

      // Navigate to the next chapter after the last completed one
      if (lastCompletedIndex < sortedChapters.length - 1) {
        const nextChapterIndex = lastCompletedIndex + 1;
        const nextChapterId = sortedChapters[nextChapterIndex]?._id;
        if (nextChapterId) {
          navigate(`chapitre/${nextChapterId}`, { replace: true });
        }
      } else if (sortedChapters.length > 0) {
        // If all chapters are completed or no chapters are completed, navigate to the first chapter
        const firstChapterId = sortedChapters[0]?._id;
        if (firstChapterId) {
          navigate(`chapitre/${firstChapterId}`, { replace: true });
        }
      }
    }
  }, [isLoading, isLoadingProgress, data, chapitreId, navigate]);

  useEffect(() => {

    function updateBreadcrumbs() {
      if (matiereId === "cours-partager") {
        setSousPages([
          { name: 'cours-partager', link: '/dashboard/classes/cours-partager/cours', icon: <Users2 size={16} /> },
          { name: data?.title, link: 'cours-details', icon: <BookText size={16} /> },
        ]);
      } else {
        setSousPages([
          { name: 'classes', link: '/dashboard/classes', icon: <Users2 size={16} /> },
          {
            name: 'cours',
            link: `classes/${matiereId}/cours`,
            icon: <BookText size={16} />,
          },
          { name: data?.title, link: 'cours-details', icon: <BookText size={16} /> },
        ]);
      }
    }
    updateBreadcrumbs();
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
