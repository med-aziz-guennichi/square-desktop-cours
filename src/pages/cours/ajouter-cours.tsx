import { getOneLesson } from '@/apis/lesson/query-slice';
import { CourseCard } from '@/components/cards/subject-card';
import { AddCoursForm } from '@/components/form/cours/add-cours-form';
import { AddCoursSchemaType } from '@/components/form/cours/schemas/add-cours-schema';
import { Button } from '@/components/ui/button';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { isRequestInProgress } from '@/lib/axios';
import { useUserStore } from '@/store/user-store';
import { useQuery } from '@tanstack/react-query';
import { Book, BookText, Eye, FilePlus2, Loader2, Users2 } from 'lucide-react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAddCoursForm } from './hooks/use-add-cours-form';
import { useCreateLessonMutation } from './hooks/use-create-lesson-mutation';
import { useLessonTitleValidation } from './hooks/use-lesson-title-validation';
import { useUpdateLessonMutation } from './hooks/use-update-lesson-mutation';
const ChaptersForm = lazy(() => import('@/components/form/cours/add-chapters-form'));
const ClickedShapterForm = lazy(
  () => import('@/components/form/cours/clicked-shapter-form'),
);

export interface ClickedChapter {
  id: string | null;
  index: number | null;
  title: string;
  description: string;
  type: 'Video' | 'Document' | 'Quiz' | ''; // or just `string` if dynamic
  quizzes: string[];
  studyMaterials: {
    fileName: string;
    displayName: string;
  }[];
  position: number;
  typeDocument?: string;
  isCreatedBefore?: boolean;
}

export default function AjouterCoursPage() {
  const user = useUserStore().decodedUser;
  const { setSousPages } = useBreadcrumb();
  const { matiereId, coursId } = useParams();

  const pathname = useLocation().pathname;
  const search = useLocation().search;
  const isUpdatePage = pathname.includes('modifier-cours');

  const coursQuery = useQuery({
    queryKey: ['cours', coursId],
    queryFn: () => getOneLesson(coursId!),
    enabled: !!coursId,
  });

  const { mutate: createLesson, isPending } = useCreateLessonMutation(
    matiereId!,
    search.split('=')[1],
  );
  const { mutate: updateLesson, isPending: isLoading } = useUpdateLessonMutation(
    coursId!,
    matiereId!,
  );
  const [clickedShapter, setClickedShapter] = useState<ClickedChapter>({
    id: null,
    index: null,
    title: '',
    description: '',
    type: '',
    quizzes: [],
    studyMaterials: [],
    position: 0,
  });
  const navigate = useNavigate();
  const form = useAddCoursForm(coursQuery?.data);
  const title = form.watch('title');
  const { isChecking, error } = useLessonTitleValidation(
    matiereId || '',
    title,
    coursId,
  );
  const onSubmit: SubmitHandler<AddCoursSchemaType> = async (data) => {
    try {
      if (isRequestInProgress()) {
        toast.warning(
          'Une autre requête est en cours. Veuillez patienter avant de soumettre une nouvelle requête.',
        );
        return;
      }
      if (error) return;

      if (isUpdatePage) {
        updateLesson(data);
      } else {
        createLesson(data);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        'Une erreur est survenue lors de la création du cours. Veuillez réessayer.',
      );
    }
  };
  useEffect(() => {
    function updateBreadcrumbs() {
      if (matiereId === 'cours-partager') {
        setSousPages([
          {
            name: 'cours-partager',
            link: '/dashboard/classes/cours-partager/cours',
            icon: <Users2 size={16} />,
          },
          {
            name: 'ajouter-cours',
            link: 'ajouter-cours',
            icon: <FilePlus2 size={16} />,
          },
        ]);
      } else {
        setSousPages([
          {
            name: 'classes',
            link: '/dashboard/classes',
            icon: <Users2 size={16} />,
          },
          { name: 'matieres', link: () => navigate(-2), icon: <Book size={16} /> },
          { name: 'cours', link: () => navigate(-1), icon: <BookText size={16} /> },
          {
            name: 'ajouter-cours',
            link: 'ajouter-cours',
            icon: <FilePlus2 size={16} />,
          },
        ]);
      }
    }
    updateBreadcrumbs();
  }, [setSousPages, navigate, matiereId]);
  return (
    <FormProvider {...form}>
      <div className="flex flex-col min-h-screen">
        <div className="p-8 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">Ajouter un contenu à la classe</h1>
            </div>
            <div className="flex items-center gap-3">
              {isUpdatePage && (
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(
                      `/dashboard/classes/${matiereId}/cours/cours/${coursId}`,
                    )
                  }
                >
                  View Preview
                  <Eye />
                </Button>
              )}
              <Button
                disabled={form.formState.isSubmitting}
                onClick={form.handleSubmit(onSubmit)}
              >
                {(isPending || isLoading) && <Loader2 className="animate-spin" />}
                {isUpdatePage ? 'Modifier' : 'Ajouter'}
              </Button>
            </div>
          </div>
        </div>
        <form className="container mx-auto px-8 py-6 flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AddCoursForm isChecking={isChecking} error={error} title={title} />
            <div className="hidden md:block">
              <CourseCard
                onClick={() => onSubmit}
                id="1"
                title={form.watch('title') || 'Untitled'}
                description={
                  form.watch('description') || 'Make your first description'
                }
                instructor={{
                  name: user?.firstName || 'John',
                  surname: user?.lastName || 'Doe',
                  avatar: `${import.meta.env.VITE_API_BASE_URL}/${user?.imageUrl}`,
                }}
                badge="Preview"
                isPreview
                badgeIcon={<Eye className="h-4 w-4" />}
              />
            </div>
          </div>
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            {clickedShapter.id ? (
              <ClickedShapterForm
                clickedChapter={clickedShapter}
                setClickedChapter={setClickedShapter}
              />
            ) : (
              <ChaptersForm setClickedShapter={setClickedShapter} />
            )}
          </Suspense>
        </form>
      </div>
    </FormProvider>
  );
}
