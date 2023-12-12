import axios from "axios";

const fetchData = async (url: string) => {
  try {
    const response = await axios.get(url);
    if (!response) {
      throw new Error(`Something went wrong.`);
    }
    return response.data;
  } catch (error: unknown) {
    throw new Error(`Error fetching data: ${error}`);
  }
};

export default fetchData;
