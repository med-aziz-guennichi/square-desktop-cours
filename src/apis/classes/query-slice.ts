import { API_ENDPOINT } from "@/constants/api";
import { api } from "@/lib/api";
import { z } from "zod";


const SingleClasseAPISchema = z.object({
    id: z.string(),
    name: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    scholarityConfigId: z.string(),
    students: z.array(
        z.object({
            _id: z.string(),
            name: z.string(),
            genre: z.string(),
        }),
    ),

});

const UserAPISchema = z.object({
    payload: z.any(),
});

const GetAllUserRequest = z.void();

const GetAllUserResponse = UserAPISchema;

const getAllUser = api<
    z.infer<typeof GetAllUserRequest>,
    z.infer<typeof GetAllUserResponse>
>({
    path: API_ENDPOINT.CLASSES,
    method: "GET",
});

export const UserAPI = {
    getAllUser,
};