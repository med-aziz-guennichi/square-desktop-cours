import {
  getChapterProgress,
  useMarkChapterAsCompleted,
} from '@/apis/lesson/query-slice';
import { CourseContent } from '@/components/course/course-content';
import CourseDetailsSkeleton from '@/components/course/course-details-skeleton';
import { Button } from '@/components/ui/button';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import { usePreventCapture } from '@/hooks/use-prevent-capture';
import { useUserStore } from '@/store/user-store';
import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function CoursDetailsPage() {
  const user = useUserStore().decodedUser;
  usePreventCapture();
  useEffect(() => {
    const applyProtection = async () => {
      try {
        if (user?.role === 'student') {
          const window = getCurrentWindow();
          await invoke('enable_protection', { window });
        }
      } catch (error) {
        console.error('Failed to enable protection:', error);
      }
    };

    applyProtection();

    return () => {
      const cleanup = async () => {
        try {
          const window = getCurrentWindow();
          await invoke('disable_protection', { window });
        } catch (error) {
          console.error('Failed to disable protection:', error);
        }
      };
      cleanup();
    };
  }, [user]);
  const { chapitreId, coursId, matiereId } = useParams();
  const navigate = useNavigate();
  const confetti = useConfettiStore();
  const { data, isLoading } = useQuery({
    queryKey: ['chapter', chapitreId],
    queryFn: () => getChapterProgress(chapitreId!, coursId!),
    enabled: !!chapitreId,
  });
  const { mutate: markAsComplete } = useMarkChapterAsCompleted(
    chapitreId!,
    coursId!,
  );
  if (isLoading) return <CourseDetailsSkeleton />;
  const handleSubmit = async () => {
    try {
      markAsComplete();
      if (data?.nextChapter) {
        const nextChapterId = data?.nextChapter?._id;
        if (nextChapterId) {
          navigate(
            `/dashboard/classes/${matiereId}/cours/cours/${coursId}/chapitre/${nextChapterId}`,
            { replace: true },
          );
        } else {
          toast.success('Félicitations ! Vous avez terminé ce chapitre.');
          confetti.onOpen();
        }
      } else {
        confetti.onOpen();
      }
    } catch (error) {
      toast.error(
        'Une erreur est survenue lors de la mise à jour de la progression. Veuillez réessayer.',
      );
      console.error(error);
    }
  };
  return (
    <div className="container mx-auto flex justify-between">
      {isLoading ? (
        <CourseDetailsSkeleton />
      ) : (
        <div className="p-4">
          <h1 className="text-2xl font-bold line-clamp-2">{data?.chapter?.title}</h1>
          <p className="mt-4 text-muted-foreground line-clamp-2 break-all">
            {data?.chapter?.description}
          </p>
          <CourseContent data={data?.chapter} />
        </div>
      )}
      <Button
        onClick={handleSubmit}
        className="mt-4"
        size="lg"
        disabled={data?.userProgress?.isComplete}
      >
        {data?.userProgress?.isComplete ? 'Terminé' : 'Marquer comme terminé'}
      </Button>
    </div>
  );
}
