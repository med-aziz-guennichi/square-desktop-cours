// src/hooks/useLessonTitleValidation.ts
import { useDebounce } from '@/hooks/use-debounce';
import { instance } from '@/lib/axios';
import { useEffect, useState } from 'react';

export const useLessonTitleValidation = (
  subjectId: string,
  title: string,
  coursId: string | undefined,
) => {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedTitle = useDebounce(title, 500); // 500ms debounce

  useEffect(() => {
    const validateTitle = async () => {
      if (!debouncedTitle || debouncedTitle.length < 3 || !subjectId) {
        setError(null);
        return;
      }

      setIsChecking(true);
      try {
        const response = await instance.get(
          '/training-company/check-new-lesson-title',
          {
            params: { subjectId, title: debouncedTitle, id: coursId },
          },
        );

        if (response.data.exists) {
          setError('Un cours avec ce titre existe déjà');
        } else {
          setError(null);
        }
      } catch (err) {
        console.error('Error validating title:', err);
        setError('Erreur de validation du titre');
      } finally {
        setIsChecking(false);
      }
    };

    validateTitle();
  }, [debouncedTitle, subjectId, coursId]);

  return { isChecking, error };
};
