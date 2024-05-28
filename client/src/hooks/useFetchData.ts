import axios, { AxiosError } from "axios";

export default function useFetchData() {
  const fetchData = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = (error as AxiosError).response?.data;
      console.log(errorMessage)
    }
  };
  return fetchData;
}
