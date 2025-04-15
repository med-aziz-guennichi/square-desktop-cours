import { z } from 'zod';

export const ChapterSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  type: z.enum(['lesson', 'quiz', 'mixed']),
  position: z.number().min(1),
  studyMaterials: z.array(z.string()).optional(),
  quizzes: z.array(z.string()).optional(),
});

export const AddCoursSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  sharedSubjectId: z.string().optional(),
  chapters: z.array(ChapterSchema).min(1, 'Ajoutez au moins un chapitre'),
});

export type AddCoursSchemaType = z.infer<typeof AddCoursSchema>;
