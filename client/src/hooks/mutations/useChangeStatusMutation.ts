import { useMutation } from "react-query";
import postData from "../../functions/postData";
import { useAuthContext } from "../useAuthContext";
import { CHANGE_STATUS } from "../../api/urls";

export const useChangeStatusMutation = () => {
  const authContext = useAuthContext();
  const mutation = useMutation(
    async (input: unknown) => await postData(CHANGE_STATUS, input),
    {
      onError: (error) => authContext.setError(error as string),
      onSettled: () => authContext.setLoading(false),
    }
  );

  mutation.isLoading ? authContext.setLoading(true) : null;
  return mutation;
};
