import { useMutation } from "react-query";
import { EDIT_FIELD } from "../../api/urls";
import postData from "../../functions/postData";
import { useAuthContext } from "../useAuthContext";

export const useEditFieldMutation = () => {
  const authContext = useAuthContext();

  const mutation = useMutation(
    async (input: unknown) => await postData(EDIT_FIELD, input),
    {
      onSuccess: (res) => {
        if (
          res === "Could not find this book!" ||
          res === "Something went wrong while trying to edit this field!"
        ) {
          authContext.setError(res);
        } else {
          authContext.setMessage("Field edited successfully!");
        }
      },
      onError: (error) => authContext.setError(error as string),
      onSettled: () => authContext.setLoading(false),
    }
  );
  mutation.isLoading ? authContext.setLoading(true) : null;
  return mutation;
};
