import { useMutation } from "react-query";
import postData from "../../functions/postData";
import { LOGIN } from "../../api/urls";
import { useAuthContext } from "../useAuthContext";

export const useLoginMutation = () => {
  const authContext = useAuthContext();
  const mutation = useMutation(
    async (input: unknown) => await postData(LOGIN, input),
    {
      onSuccess: (res) => {
        if (
          res === "This email address is not registered!" ||
          res === "The password is incorrect!"
        ) {
          authContext.setError(res);
        } else {
          authContext.setCurrentUser(res);
          authContext.setMessage("Success!");
        }
      },
      onError: (error) => authContext.setError(error as string),
      onSettled: () => authContext.setLoading(false),
    }
  );

  mutation.isLoading ? authContext.setLoading(true) : null;
  return mutation;
};
