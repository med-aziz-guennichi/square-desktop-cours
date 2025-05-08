import { z } from 'zod';

// Option schema
export const OptionSchema = z.object({
  text: z.string().min(1, 'Le texte de l’option est requis'),
  correct: z.boolean().optional(), 
});

// Question schema
export const QuestionSchema = z.object({
  question: z.string().min(1, 'La question est requise'),
  options: z.array(OptionSchema).min(1, 'Ajoutez au moins une option'),
  isboolean: z.boolean().optional(),
  explanation: z.string().optional(),
  point: z.number().optional(),
});

// Main Quiz schema
export const QuizSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'), // because `Description` is required in Mongoose
  type: z.enum(["choix-unique", "choix-multiple", "boolean", "texte"]).optional(),
  instructor: z.string().min(1, 'L’instructeur est requis'),
  subject: z.string().optional(),
  sharedSubject: z.string().optional(),
  lesson: z.string().optional(),
  questions: z.array(QuestionSchema).min(1,'Ajoutez au moins une question'),
  scholarityConfigId: z.string().optional(),
  totalAttempts: z.number().optional().default(0),
  totalTimeTaken: z.number().optional().default(0),
  successRate: z.number().optional().default(0),
  score: z.number().optional().default(0),
});


export type QuizSchemaType = z.infer<typeof QuizSchema>;
