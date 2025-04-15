// components/form/chapters-form.tsx
import { useAddChaptersSheet } from '@/pages/cours/hooks/use-add-chapters-sheet';
import { Plus, X } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { AddChaptersSheet } from './add-chapters-sheet';

export const ChaptersForm = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'chapters' });
  const { setSheetOpen, sheetOpen } = useAddChaptersSheet();
  const handleAddInput = () => {
    append({ title: '', description: '', type: 'lesson' });
  };

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
          {fields.length > 0 ? (
            <>
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 border p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Chapitre {index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <FormField
                    control={control}
                    name={`chapters.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre</FormLabel>
                        <FormControl>
                          <Input placeholder="Titre du chapitre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`chapters.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Description du chapitre..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`chapters.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <select {...field} className="border rounded p-2 w-full">
                            <option value="">Sélectionner</option>
                            <option value="lesson">Cours</option>
                            <option value="quiz">Quiz</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`chapters.${index}.position`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-muted-foreground mb-4">Aucun chapitre ajouté</p>
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setSheetOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un chapitre
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
      <AddChaptersSheet
        sheetOpen={sheetOpen}
        setSheetOpen={setSheetOpen}
        remove={remove}
        fields={fields}
        handleAddInput={handleAddInput}
      />
    </>
  );
};
