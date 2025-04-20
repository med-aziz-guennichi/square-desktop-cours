import {
  getChapterProgress,
  useMarkChapterAsCompleted,
} from '@/apis/lesson/query-slice';
import { CourseContent } from '@/components/course/course-content';
import CourseDetailsSkeleton from '@/components/course/course-details-skeleton';
import { Button } from '@/components/ui/button';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function CoursDetailsPage() {
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
          <h1 className="text-2xl font-bold">{data?.chapter?.title}</h1>
          <p className="mt-4 text-muted-foreground">{data?.chapter?.description}</p>
          <CourseContent data={data} />
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
