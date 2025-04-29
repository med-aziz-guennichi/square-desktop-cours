import {
  AddCoursSchema,
  AddCoursSchemaType,
} from '@/components/form/cours/schemas/add-cours-schema';
import { Cours } from '@/types/cours.interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

export const useAddCoursForm = (coursQuery: Cours | undefined) => {
  const methods = useForm<AddCoursSchemaType>({
    resolver: zodResolver(AddCoursSchema),
    defaultValues: {
      title: '',
      description: '',
      chapters: [],
    },
    mode: 'onChange',
  });

  const chapterFieldArray = useFieldArray({
    control: methods.control,
    name: 'chapters',
  });

  // Reset the form when coursQuery is loaded
  useEffect(() => {
    if (coursQuery) {
      methods.reset({
        title: coursQuery.title || '',
        description: coursQuery.description || '',
        chapters:
          coursQuery.chapters?.map((chapter) => ({
            ...chapter,
            isCreatedBefore: true,
            type: chapter.type as 'Video' | 'Document' | 'Quiz' | undefined,
            typeDocument: ['word', 'excel', 'upload'].includes(chapter.typeDocument)
              ? (chapter.typeDocument as 'word' | 'excel' | 'upload')
              : undefined,
          })) || [],
      });
    }
  }, [coursQuery, methods]);

  return {
    ...methods,
    chapterFieldArray,
  };
};
