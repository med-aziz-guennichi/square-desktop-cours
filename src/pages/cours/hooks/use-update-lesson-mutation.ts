import { AddCoursSchemaType } from '@/components/form/cours/schemas/add-cours-schema';
import { instance } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useUpdateLessonMutation = (lessonId: string, matiereId: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: AddCoursSchemaType) => {
      const response = await instance.patch(
        `/training-company/update-new-lesson/${lessonId}`,
        data,
      );
      return response.data;
    },
    mutationKey: ['update-lesson', lessonId],
    onError: (error) => {
      console.error('Failed to update lesson', error);
      toast.error("Une erreur s'est produite lors de la mise à jour du cours.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cours', matiereId] });
      queryClient.invalidateQueries({ queryKey: ['cours', lessonId] });
      toast.success('Cours mis à jour avec succès.');
      navigate(-1);
    },
  });
};
