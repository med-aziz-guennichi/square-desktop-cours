import { instance } from '@/lib/axios';
import { useSocket } from '@/providers/socket';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MeetType } from '../component/schema';

export const useCreateMeetMutation = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: MeetType) => {
      const response = await instance.post('/create-meet-with-users', data);
      return response.data;
    },
    mutationKey: ['create-meet'],
    onError: (error) => {
      console.error('Failed to create meet', error);
      toast.error("Une erreur s'est produite lors de la création du meet.");
    },
    onSuccess: (response) => {
      toast.success('Meet créé avec succès.');
      socket.emit('send-meet-notification', response.notifications);
      navigate(`/meet/${response.meet.name}`);
    },
  });
};
