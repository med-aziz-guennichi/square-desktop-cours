import { z } from 'zod';

// Option schema
const OptionSchema = z.object({
  text: z.string().min(1, 'Option text is required'),
  correct: z.boolean().optional(),
});

// Question schema
const QuestionSchema = z.object({
  question: z.string().min(1, 'Question text is required'),
  options: z.array(OptionSchema).min(1, 'At least one option is required'),
  isboolean: z.boolean().optional(),
  explanation: z.string().optional(),
});

// Full Quiz schema
const QuizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required'),
  scholarityConfigId: z.string().optional(),
  questions: z.array(QuestionSchema).min(1, 'At least one question is required'),
  totalAttempts: z.number().min(0).optional(),
  totalTimeTaken: z.number().min(0).optional(),
  successRate: z.number().min(0).max(100).optional(),
});

// Chapter schema with embedded `quiz`
export const ChapterSchema = z.object({
  isCreatedBefore: z.boolean().optional(),
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
  quizzes: z.array(QuizSchema).optional(),
});

// Main course schema
export const AddCoursSchema = z.object({
  title: z.string().min(5, 'Le titre est requis'),
  description: z.string().min(20, 'La description est requise'),
  chapters: z.array(ChapterSchema).min(1, 'Ajoutez au moins un chapitre'),
});

export type AddCoursSchemaType = z.infer<typeof AddCoursSchema>;
// export type Quiz = z.infer<typeof QuizSchema>;