import axios, { AxiosError } from "axios";
import { useAuthContext } from "./useAuthContext";

export default function usePostDataWithToken() {
  const authContext = useAuthContext();
  const postDataWithToken = async (url: string, input: unknown) => {
    const token = authContext.token?.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    if (!token) {
      authContext.setError("User not authenticated!");
    }
    try {
      const response = await axios.post(url, input, { headers: headers });
      return response.data;
    } catch (error: unknown) {
      const errorMessage = (error as AxiosError).response?.data;
      authContext.setOpenError(true);
      authContext.setError(`Error: ${errorMessage}`);
    }
  };
  return postDataWithToken;
}
