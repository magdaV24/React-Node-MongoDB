import axios, { AxiosError } from "axios";
import { useAppContext } from "./useAppContext";
/**
 * Uses axios to perform a POST request to the server. 
 * It returns a function, postData, that takes the URL and the input from the client 
 * and sends it to tbe backend.
 * It's used in creating mutations when the user is authenticated.
 */
export default function usePostDataWithToken() {
  const appContext = useAppContext();
  const postDataWithToken = async (url: string, input: unknown) => {
    const token = appContext.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    if (!token) {
      throw new Error("No user is authenticated!");
    }
    try {
      const response = await axios.post(url, input, { headers: headers });
      return response;
    } catch (error: unknown) {
      const errorMessage = (error as AxiosError).response?.data;
      throw new Error(
        `Error while trying to post data for an authenticated user: ${errorMessage}`
      );
    }
  };
  return postDataWithToken;
}
