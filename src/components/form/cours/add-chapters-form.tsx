// components/form/chapters-form.tsx
import { ClickedChapter } from '@/pages/cours/ajouter-cours';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { ChaptersManager } from './chapters-manager';

export const ChaptersForm = ({
  setClickedShapter,
}: {
  setClickedShapter: (chapter: ClickedChapter) => void;
}) => {
  const { control } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'chapters',
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Contenu du cours</CardTitle>
          <CardDescription>
            Organisez votre cours en modules et leçons
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ChaptersManager
            fields={fields}
            append={append}
            remove={remove}
            move={move}
            formErrors={control._formState.errors}
            setClickedShapter={setClickedShapter}
          />
        </CardContent>
      </Card>
    </>
  );
};
