import axios, { AxiosError } from "axios";
/**
 * Uses axios to perform a POST request to the server. 
 * It returns a function, postData, that takes the URL and the input from the client 
 * and sends it to tbe backend.
 * It's used in creating mutations when the user isn't authenticated.
 */
export default function usePostData(){
    const postData = async (url: string, input: unknown) => {
        try {
            const response = await axios.post(url, input);
            return response;
        } catch (error) {
            const errorMessage = (error as AxiosError).response?.data;
            throw new Error(`${errorMessage}`);
        }
    }
    return postData;
} 