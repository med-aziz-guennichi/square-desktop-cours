import { API_ENDPOINT } from "@/constants/api";
import { instance } from "@/lib/axios";

export async function getMatieres(id:string, userId:string) {
  try {
    const response = await instance.get(`${API_ENDPOINT.MATIERES}/${id}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch classes", error);
    throw error;
  }
}
