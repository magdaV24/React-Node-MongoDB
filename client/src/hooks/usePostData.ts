import axios, { AxiosError } from "axios";
import { useAuthContext } from "../hooks/useAuthContext";

export default function usePostData() {
  const authContext = useAuthContext();
  const postData = async (url: string, input: unknown) => {
    try {
      const response = await axios.post(url, input);
      return response.data;
    } catch (error) {
      const errorMessage = (error as AxiosError).response?.data;
      authContext.setOpenError(true);
      authContext.setError(`Error: ${errorMessage}`);
    }
  };
  return postData;
}
