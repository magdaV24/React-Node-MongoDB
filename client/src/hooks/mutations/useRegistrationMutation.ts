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
          authContext.setError(res);
        } else {
          authContext.setMessage("Account created successfully!");
        }
      },
      onError: (error) => {
        authContext.setError(error as string);
      },
      onSettled: () => authContext.setLoading(false),
    }
  );
  mutation.isLoading ? authContext.setLoading(true) : null;
  return mutation;
};
