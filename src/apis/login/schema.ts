import { z } from "zod";

const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=~`+[{\]}\\|:;"'<,>.?/])[a-zA-Z\d!@#$%^&*()\-_=~`+[{\]}\\|:;"'<,>.?/\s]{8,50}$/;
export const SignInFormSchema = z.object({
    email: z
        .string()
        .min(1, "L'adresse e-mail est obligatoire")
        .trim()
        .email({ message: "Adresse e-mail invalide" })
        .toLowerCase(),

    password: z
        .string()
        .trim()
        .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
        .max(50, { message: "Le mot de passe ne doit pas dépasser 50 caractères" })
        .regex(passwordRegEx, {
            message:
                "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial",
        }),

    macAddress: z.string().optional().nullable(),
});

export type SignInFormType = z.infer<typeof SignInFormSchema>;

export type SignInFieldName = keyof SignInFormType;

export const SignInAPIResponseSchema = z.object({
    status: z.boolean(),
    message: z.string(),
    payload: z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
    }),
});