// hooks/useAddCoursForm.ts
import {
  AddCoursSchema,
  AddCoursSchemaType,
} from '@/components/form/cours/schemas/add-cours-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';

export const useAddCoursForm = () => {
  const methods = useForm<AddCoursSchemaType>({
    resolver: zodResolver(AddCoursSchema),
    defaultValues: {
      title: '',
      description: '',
      chapters: [],
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
