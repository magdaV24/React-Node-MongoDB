import { useMutation } from "react-query";
import postData from "../../functions/postData";
import { REGISTER } from "../../api/urls";
import { useAuthContext } from "../useAuthContext";

export const useRegistrationMutation = () => {
  const authContext = useAuthContext();
  const mutation = useMutation(
    async (input: unknown) => await postData(REGISTER, input),
    {
      onSuccess: (res) => {
        if (
          res === "The email provided is already in use!" ||
          res === "This username is taken!"
        ) {
          authContext.setOpenError(true);
          authContext.setError(res);
        } else {
          authContext.setOpenMessage(true);
          authContext.setMessage("Account created successfully!");
        }
      },
      onError: (error: string) => {
        authContext.setOpenError(true);
        authContext.setError(error || "An error occurred");
      },
    }
  );
  const registerLoading = mutation.isLoading
  return {mutation, registerLoading};
};
