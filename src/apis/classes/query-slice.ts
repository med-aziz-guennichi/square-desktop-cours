import { API_ENDPOINT } from '@/constants/api';
import { instance } from '@/lib/axios';

export async function getClasses(
  scholarityConfigId: string,
  currentPage: number = 1,
  itemsPerPage: number = 6,
  filters?: {
    name?: string;
    subjectId?: string;
    instructorId?: string;
  },
) {
  try {
    const response = await instance.get(
      `${API_ENDPOINT.CLASSES}/${scholarityConfigId}`,
      {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          ...filters,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch classes', error);
    throw error;
  }
}
