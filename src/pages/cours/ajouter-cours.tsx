// pages/cours/ajouter-cours.tsx
import { CourseCard } from '@/components/cards/subject-card';
import { ChaptersForm } from '@/components/form/add-chapters-form';
import { AddCoursForm } from '@/components/form/add-cours-form';
import { AddCoursSchemaType } from '@/components/form/schemas/add-cours-schema';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { Book, BookText, Eye, FilePlus2, Users2 } from 'lucide-react';
import { useEffect } from 'react';
import { FormProvider, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAddCoursForm } from './hooks/use-add-cours-form';

export default function AjouterCoursPage() {
  const { setSousPages } = useBreadcrumb();
  const navigate = useNavigate();
  const form = useAddCoursForm();
  const onSubmit: SubmitHandler<AddCoursSchemaType> = async (data) => {
    console.warn(data);
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
          </div>
        </div>
        {/* <Button onClick={form.handleSubmit(onSubmit)}>Submit</Button> */}
        <form className="container mx-auto px-8 py-6 flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AddCoursForm />
            <div className="hidden md:block">
              <CourseCard
                onClick={() => onSubmit}
                id="1"
                title={form.watch('title') || 'Aziz Guennichi'}
                description={
                  form.watch('description') || 'this is the first Description'
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
          <ChaptersForm />
        </form>
      </div>
    </FormProvider>
  );
}
