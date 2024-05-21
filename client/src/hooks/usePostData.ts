import axios, { AxiosError } from "axios";

export default function usePostData(){
    // const appContext = useAppContext();
    const postData = async (url: string, input: unknown) => {
        try {
            const response = await axios.post(url, input);
            return response;
        } catch (error) {
            const errorMessage = (error as AxiosError).response?.data;
            console.log(errorMessage);
        }
    }
    return postData;
} 