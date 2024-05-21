import axios, { AxiosError } from "axios";
import { useAppContext } from "./useAppContext";

export default function useFetchData () {
    const appContext = useAppContext();
    const fetchData = async (url: string) => {
      const token = appContext.token;
      const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      };
      if (!token) {
        appContext.setError("User not authenticated!");
      }
      try {
        const response = await axios.get(url, { headers: headers });
        return response.data;
      } catch (error: unknown) {
        const errorMessage = (error as AxiosError).response?.data;
        appContext.setOpenErrorAlert(true);
        appContext.setError(`Error: ${errorMessage}`);
      }
    };
    return fetchData;
  }