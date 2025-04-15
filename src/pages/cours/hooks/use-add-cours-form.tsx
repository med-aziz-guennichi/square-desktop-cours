// hooks/useAddCoursForm.ts
import {
  AddCoursSchema,
  AddCoursSchemaType,
} from '@/components/form/schemas/add-cours-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';

export const useAddCoursForm = () => {
  const methods = useForm<AddCoursSchemaType>({
    resolver: zodResolver(AddCoursSchema),
    defaultValues: {
      title: '',
      description: '',
      sharedSubjectId: '',
      // chapters: [{ description: "", position: 0, title: "", quizzes: [""], studyMaterials: [], type: "lesson" }],
    },
  });

  const chapterFieldArray = useFieldArray({
    control: methods.control,
    name: 'chapters',
  });

  return {
    ...methods,
    chapterFieldArray,
  };
};
