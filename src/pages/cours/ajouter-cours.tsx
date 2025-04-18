// pages/cours/ajouter-cours.tsx
import { CourseCard } from '@/components/cards/subject-card';
import { ChaptersForm } from '@/components/form/cours/add-chapters-form';
import { AddCoursForm } from '@/components/form/cours/add-cours-form';
import { ClickedShapterForm } from '@/components/form/cours/clicked-shapter-form';
import { AddCoursSchemaType } from '@/components/form/cours/schemas/add-cours-schema';
import { Button } from '@/components/ui/button';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { Book, BookText, Eye, FilePlus2, Loader2, Users2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAddCoursForm } from './hooks/use-add-cours-form';
import { useCreateLessonMutation } from './hooks/use-create-lesson-mutation';

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
}

export default function AjouterCoursPage() {
  const { setSousPages } = useBreadcrumb();
  const { matiereId } = useParams();

  const { mutate: createLesson, isPending } = useCreateLessonMutation(matiereId!);
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
  const form = useAddCoursForm();
  const onSubmit: SubmitHandler<AddCoursSchemaType> = async (data) => {
    try {
      createLesson(data);
    } catch (error) {
      console.error(error);
      toast.error(
        'Une erreur est survenue lors de la création du cours. Veuillez réessayer.',
      );
    }
  };
  useEffect(() => {
    setSousPages([
      { name: 'classes', link: '/dashboard/classes', icon: <Users2 size={16} /> },
      { name: 'matieres', link: () => navigate(-2), icon: <Book size={16} /> },
      { name: 'cours', link: () => navigate(-1), icon: <BookText size={16} /> },
      {
        name: 'ajouter-cours',
        link: 'ajouter-cours',
        icon: <FilePlus2 size={16} />,
      },
    ]);
  }, [setSousPages, navigate]);
  return (
    <FormProvider {...form}>
      <div className="flex flex-col min-h-screen">
        <div className="p-8 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">Ajouter un contenu à la classe</h1>
            </div>
            <Button
              disabled={form.formState.isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
            >
              {isPending && <Loader2 className="animate-spin" />}
              Ajouter!
            </Button>
          </div>
        </div>
        <form className="container mx-auto px-8 py-6 flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AddCoursForm />
            <div className="hidden md:block">
              <CourseCard
                onClick={() => onSubmit}
                id="1"
                title={form.watch('title') || 'Untitled'}
                description={
                  form.watch('description') || 'Make your first description'
                }
                instructor={{
                  name: 'John Doe',
                  surname: 'Doe',
                  avatar: 'https://via.placeholder.com/150',
                }}
                badge="Preview"
                isPreview
                badgeIcon={<Eye className="h-4 w-4" />}
              />
            </div>
          </div>
          {clickedShapter.id ? (
            <ClickedShapterForm
              clickedChapter={clickedShapter}
              setClickedChapter={setClickedShapter}
            />
          ) : (
            <ChaptersForm setClickedShapter={setClickedShapter} />
          )}
        </form>
      </div>
    </FormProvider>
  );
}
