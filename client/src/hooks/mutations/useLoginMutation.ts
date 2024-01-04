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
          authContext.setOpenMessage(true)
          authContext.setError(res);
        } else {
          authContext.setCurrentUser(res);
          authContext.setOpenMessage(true);
          authContext.setMessage("Success!");
        }
      },
      onError: (error) => {
        authContext.setError(error as string);
        authContext.setOpenError(true);
      },
    }
  );

  const loginLoading = mutation.isLoading;
  return {mutation, loginLoading};
};
