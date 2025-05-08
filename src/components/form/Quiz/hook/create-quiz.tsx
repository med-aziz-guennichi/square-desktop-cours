import { instance } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { QuizSchemaType } from '../schemas/quiz-schema';
import { API_ENDPOINT } from '@/constants/api';

// Assuming the API returns a response, you can define it like this:
interface CreateQuizResponse {
  success: boolean;
  message: string;
  // any other response fields you expect
}
//useCreateLessonMutation
export const useCreateQuizMutation = (scholarityConfigId : string) => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation<CreateQuizResponse, Error, QuizSchemaType>({
    mutationFn: async (data: QuizSchemaType) => {
      const response = await instance.post<CreateQuizResponse>(
        `${API_ENDPOINT.CREATE_QUIZ}`,
        data as QuizSchemaType,
      );
      return response.data;
    },
    mutationKey: ['scholarityConfigId', scholarityConfigId],
   
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scholarityConfigId', scholarityConfigId] });
      // Handle success here
      toast.success('Le Quiz a été créé avec succès.');
      navigate(-1);
    },
  });
};
