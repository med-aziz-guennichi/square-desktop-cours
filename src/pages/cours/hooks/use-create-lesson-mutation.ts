import { useMutation } from "@tanstack/react-query";
import { instance } from "@/lib/axios";
import { AddCoursSchemaType } from "@/components/form/cours/schemas/add-cours-schema";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


// Assuming the API returns a response, you can define it like this:
interface CreateLessonResponse {
    success: boolean;
    message: string;
    // any other response fields you expect
}

export const useCreateLessonMutation = () => {
    const navigate = useNavigate();
    return useMutation<CreateLessonResponse, Error, AddCoursSchemaType>({
        mutationFn: async (data: AddCoursSchemaType) => {
            const response = await instance.post<CreateLessonResponse>('/training-company/create-new-lesson', data as AddCoursSchemaType);
            return response.data;
        },
        onError: (error) => {
            // Handle error here
            console.error("Error creating lesson:", error);
            // Optionally, you can show a toast or notification to the user
            toast.error('Une erreur est survenue lors de la création du cours. Veuillez réessayer.');
        },
        onSuccess: () => {
            // Handle success here
            toast.success('Le cours a été créé avec succès.');
            // Optionally, navigate to another page or perform other actions
            navigate(-1); // Navigate back to the previous page
        }
    });
};
