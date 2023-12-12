import axios from "axios";

const postData = async (url: string, input: unknown) => {
    try {
        const response = await axios.post(url, input)
        if(!response){
            throw new Error(`Something went wrong.`)
        }
        return response.data;

    } catch (error) {
        throw new Error(`Error: ${error}`)
    }
}

export default postData;