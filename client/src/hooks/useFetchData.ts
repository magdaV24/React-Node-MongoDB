import axios, { AxiosError } from "axios";
import { useAuthContext } from "./useAuthContext";

export default function useFetchData() {
  const authContext = useAuthContext();
  const fetchData = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = (error as AxiosError).response?.data;
      authContext.setOpenError(true);
      authContext.setError(`Error: ${errorMessage}`);
    }
  };
  return fetchData;
}
