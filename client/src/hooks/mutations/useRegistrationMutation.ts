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
          authContext.setOpen(true);
          authContext.setError(res);
        } else {
          authContext.setOpen(true);
          authContext.setMessage("Account created successfully!");
        }
      },
      onError: (error: string) => {
        authContext.setOpen(true);
        authContext.setError(error || "An error occurred");
      },
      onSettled: () => authContext.setLoading(false),
      onMutate: () => authContext.setLoading(true),
    }
  );
  return mutation;
};
