import { instance } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useDeleteMeetMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await instance.post(`/delete-meet/${id}`);
      return response.data;
    },
    mutationKey: ['delete-meet'],
    onError: (error) => {
      console.error('Failed to delete meet', error);
    },
    onSuccess: (response) => {
      console.error(response);
      navigate('/');
    },
  });
};
