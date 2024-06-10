import axios, { AxiosError } from "axios";

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