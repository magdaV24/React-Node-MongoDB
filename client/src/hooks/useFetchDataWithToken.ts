import { useAuthContext } from "./useAuthContext";
import axios, { AxiosError } from "axios";

export default function useFetchDataWithToken() {
  const authContext = useAuthContext();
  const fetchDataWithToken = async (url: string) => {
    const token = authContext.token?.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    if (!token) {
      authContext.setError("User not authenticated!");
    }
    try {
      const response = await axios.get(url, { headers: headers });
      return response.data;
    } catch (error: unknown) {
      const errorMessage = (error as AxiosError).response?.data;
      authContext.setOpenError(true);
      authContext.setError(`Error: ${errorMessage}`);
    }
  };
  return fetchDataWithToken;
}
