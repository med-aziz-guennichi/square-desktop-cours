import { API_ENDPOINT } from '@/constants/api';
import { instance } from '@/lib/axios';
import { toast } from 'sonner';

export async function getLessons(subjectId: string) {
  try {
    const response = await instance.get(`${API_ENDPOINT.LESSONS}/${subjectId}`);
    return response.data;
  } catch (error) {
    toast.error("Une erreur s'est produite lors de la récupération des cours.");
    console.error('Failed to fetch classes', error);
  }
}

export async function getOneLesson(lessonId: string) {
  try {
    const response = await instance.get(`${API_ENDPOINT.ONELESSON}/${lessonId}`);
    return response.data;
  } catch (error) {
    toast.error(
      "Une erreur s'est produite lors de la récupération des détails du cours.",
    );
    console.error('Failed to fetch classes', error);
  }
}

export async function getProgress(lessonId: string) {
  try {
    const response = await instance.get(`${API_ENDPOINT.PROGRESS}/${lessonId}`);
    return response.data;
  } catch (error) {
    toast.error(
      "Une erreur s'est produite lors de la récupération de la progression.",
    );
    console.error('Failed to fetch classes', error);
  }
}

export async function getChapter(chapterId: string) {
  try {
    const response = await instance.get(`${API_ENDPOINT.CHAPTER}/${chapterId}`);
    return response.data;
  } catch (error) {
    toast.error("Une erreur s'est produite lors de la récupération du chapitre.");
    console.error('Failed to fetch chapters', error);
  }
}
