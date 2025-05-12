import { instance } from '@/lib/axios';
import { toast } from 'sonner';

export async function getMeetByName(name: string) {
  try {
    const response = await instance.post('/get-meet-by-name', { name });
    return response.data;
  } catch (error) {
    toast.error(
      "Une erreur s'est produite lors de la récupération de la video conferance.",
    );
    console.error('Failed to fetch video-conferance', error);
  }
}
