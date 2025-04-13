import { API_ENDPOINT } from '@/constants/api';
import { instance } from '@/lib/axios';

export async function getClasses(scholarityConfigId: string, currentPage:number, itemsPerPage: number) {
  try {
    const response = await instance.get(
      `${API_ENDPOINT.CLASSES}/${scholarityConfigId}?page=${currentPage}&limit=${itemsPerPage}`,
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch classes', error);
    throw error;
  }
}
