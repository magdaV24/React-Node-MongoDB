import { useMutation } from "react-query";
import { useAuthContext } from "../useAuthContext";
import postData from "../../functions/postData";
import { LIKE_OBJECT } from "../../api/urls";

export const useLikeMutation = () => {
  const authContext = useAuthContext();

  const mutation = useMutation(
    async (input: unknown) => await postData(LIKE_OBJECT, input),
    {
      onError: (error) => {
        authContext.setError(error as string);
        authContext.setOpen(true);
      },
      onSettled: () => authContext.setLoading(false),
    }
  );
  mutation.isLoading ? authContext.setLoading(true) : null;
  return mutation;
};
