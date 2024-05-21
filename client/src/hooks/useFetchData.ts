import axios, { AxiosError } from "axios";
import { useAppContext } from "./useAppContext";

export default function useFetchData() {
  const appContext = useAppContext()
  const fetchData = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = (error as AxiosError).response?.data;
      appContext.setOpenErrorAlert(true);
      appContext.setError(`Error: ${errorMessage}`);
    }
  };
  return fetchData;
}
