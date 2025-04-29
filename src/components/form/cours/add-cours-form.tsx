// components/form/add-cours-form.tsx
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';

export const AddCoursForm = ({
  isChecking,
  error,
  title,
}: {
  isChecking: boolean;
  error: string | null;
  title: string;
}) => {
  const form = useFormContext();

  useEffect(() => {
    if (error) {
      form.setError('title', { type: 'manual', message: error });
    }
  }, [error, form]);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Informations générales</CardTitle>
        <CardDescription>
          Renseignez les informations de base du cours
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre du cours</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="Ex: Développement Web Full Stack"
                    {...field}
                    name="title"
                  />
                </FormControl>
                {isChecking && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              <FormMessage />
              {!isChecking && !error && title && title.length >= 3 && (
                <p className="text-sm text-green-600">Titre disponible</p>
              )}
            </FormItem>
          )}
          rules={{
            required: 'Le titre du cours est obligatoire',
            minLength: {
              value: 3,
              message: 'Le titre doit contenir au moins 3 caractères',
            },
            validate: () => !error || error, // Use our custom error state
          }}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description du cours..."
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
