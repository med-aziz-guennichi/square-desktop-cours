import { z } from 'zod';

export const ChapterSchema = z.object({
  title: z.string().min(5, 'Le titre est requis'),
  description: z.string().min(20, 'La description est requise'),
  type: z.enum(['Video', 'Document', 'Quiz']),
  position: z.number().min(1),
  studyMaterials: z
    .array(
      z.object({
        fileName: z.string(),
        displayName: z.string(),
      }),
    )
    .optional(),
  typeDocument: z.enum(['word', 'excel', 'upload']).optional(),
  jsonFiles: z.string().optional(),
  files: z.any().optional(),
  quizzes: z.array(z.string()).optional(),
});

export const AddCoursSchema = z.object({
  title: z.string().min(5, 'Le titre est requis'),
  description: z.string().min(20, 'La description est requise'),
  // sharedSubjectId: z.string().optional(),
  chapters: z.array(ChapterSchema).min(1, 'Ajoutez au moins un chapitre'),
});

export type AddCoursSchemaType = z.infer<typeof AddCoursSchema>;
