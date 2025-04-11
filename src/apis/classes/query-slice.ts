import { API_ENDPOINT } from '@/constants/api';
import { instance } from '@/lib/axios';

export async function getClasses(scholarityConfigId: string) {
  try {
    const response = await instance.get(
      `${API_ENDPOINT.CLASSES}/${scholarityConfigId}`,
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch classes', error);
    throw error;
  }
}
