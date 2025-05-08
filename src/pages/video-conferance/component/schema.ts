import { z } from 'zod';

const nameRegex = /^[a-zA-Z0-9_-]*$/;
export const meetSchema = z.object({
  name: z.string().min(1, 'Le nom du meet est obligatoire').regex(nameRegex, {
    message:
      'Le nom du meet ne doit contenir que des lettres, des chiffres, des tirets et des underscores',
  }),
  users: z.array(z.string()).min(1, 'Vous devez avoir au moins 1 utilisateur'),
});

export type MeetType = z.infer<typeof meetSchema>;
