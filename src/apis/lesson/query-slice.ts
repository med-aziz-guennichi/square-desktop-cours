import { API_ENDPOINT } from "@/constants/api";
import { instance } from "@/lib/axios";

export async function getLessons(subjectId: string) {
  try {
    const response = await instance.get(`${API_ENDPOINT.LESSONS}?subjectId=${subjectId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch classes", error);
    throw error;
  }
}
