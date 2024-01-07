import { useMutation } from "react-query";
import { useAuthContext } from "../useAuthContext";
import { ADD_READING_STATUS } from "../../api/urls";
import usePostData from "../usePostData";

function useAddStatusMutation () {
  const authContext = useAuthContext();
  const postData = usePostData();
  const mutation = useMutation(
    async (input: unknown) => await postData(ADD_READING_STATUS, input),
    {
      onError: (error) => {
        authContext.setError(error as string);
        authContext.setOpenError(true);
      },
    }
  );

  const statusLoading = mutation.isLoading;
  return {mutation, statusLoading};
}

export default function useAddStatus() {
  const {mutation, statusLoading} = useAddStatusMutation();

  const add_status = async (input: unknown) => {
    try {
    await  mutation.mutateAsync(input);
    } catch (error) {
      console.log(`Error: ${error}`)
    }
  };
  return {add_status, statusLoading};
}
