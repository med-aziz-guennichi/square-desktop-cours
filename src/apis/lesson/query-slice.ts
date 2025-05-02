import { API_ENDPOINT } from '@/constants/api';
import { instance } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export async function getLessons(subjectId: string, queryParams = '') {
  try {
    const response = await instance.get(
      subjectId !== 'cours-partager'
        ? `${API_ENDPOINT.LESSONS}/${subjectId}?${queryParams}`
        : `${API_ENDPOINT.SHARED_LESSONS}?${queryParams}`,
    );
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

export async function getChapterProgress(chapterId: string, courseId: string) {
  try {
    const response = await instance.get(
      `${API_ENDPOINT.CHAPTER_PROGRESS}/${courseId}/${chapterId}`,
    );
    return response.data;
  } catch (error) {
    toast.error(
      "Une erreur s'est produite lors de la récupération de la progression du chapitre.",
    );
    console.error('Failed to fetch chapters', error);
  }
}

export async function markChapterAsCompleted(chapterId: string) {
  try {
    const response = await instance.post(
      `${API_ENDPOINT.MARK_CHAPTER_COMPLETED}/${chapterId}`,
    );
    return response.data;
  } catch (error) {
    toast.error(
      "Une erreur s'est produite lors de la mise à jour de la progression.",
    );
    console.error('Failed to mark chapter as completed', error);
  }
}

export async function deleteLesson(lessonId: string) {
  try {
    const response = await instance.delete(
      `${API_ENDPOINT.DELETE_LESSON}/${lessonId}`,
    );
    return response.data;
  } catch (error) {
    toast.error("Une erreur s'est produite lors de la suppression du cours.");
    console.error('Failed to delete lesson', error);
  }
}

export const useDeleteLesson = (lessonId: string, matiereId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteLesson(lessonId),
    mutationKey: ['delete-lesson', lessonId],
    onError: (error) => {
      toast.error("Une erreur s'est produite lors de la suppression du cours.");
      console.error('Failed to delete lesson', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cours', matiereId] });
      toast.success('Cours supprimé avec succès.');
    },
  });
};

export const useMarkChapterAsCompleted = (chapterId: string, coursId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markChapterAsCompleted(chapterId),
    mutationKey: ['mark-chapter-completed', chapterId],
    onError: (error) => {
      toast.error(
        "Une erreur s'est produite lors de la mise à jour de la progression.",
      );
      console.error('Failed to mark chapter as completed', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress', coursId] });
      queryClient.invalidateQueries({ queryKey: ['chapter', chapterId] });
      toast.success('Chapitre marqué comme terminé avec succès.');
    },
  });
};
