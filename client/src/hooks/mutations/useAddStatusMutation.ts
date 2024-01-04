import { useMutation } from "react-query";
import postData from "../../functions/postData";
import { useAuthContext } from "../useAuthContext";
import { ADD_READING_STATUS } from "../../api/urls";

export const useAddStatusMutation = () => {
  const authContext = useAuthContext();
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
};
