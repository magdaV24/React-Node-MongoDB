import axios, { AxiosError } from "axios";
/**
 * Uses axios to perform a GET request to the server. 
 * It returns a function, fetchData, that takes the URL and sends the request it to tbe backend.
 * It's used in creating queries when the user isn't authenticated.
 */
export default function useFetchData() {
  const fetchData = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = (error as AxiosError).response?.data;
      throw new Error(`${errorMessage}`); 
    }
  };
  return fetchData;
}
