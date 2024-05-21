import axios, { AxiosError } from "axios";
import { useAppContext } from "./useAppContext";

export default function usePostDataWithToken() {
  const appContext = useAppContext();
  const postDataWithToken = async (url: string, input: unknown) => {
    const token = appContext.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    if (!token) {
      appContext.setError("User not authenticated!");
    }
    try {
      const response = await axios.post(url, input, { headers: headers });
      return response;
    } catch (error: unknown) {
      const errorMessage = (error as AxiosError).response?.data;
      appContext.setOpenErrorAlert(true);
      appContext.setError(`Error: ${errorMessage}`);
    }
  };
  return postDataWithToken;
}
