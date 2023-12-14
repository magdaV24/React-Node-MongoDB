import { useMutation } from "react-query";
import { useAuthContext } from "../useAuthContext";
import postData from "../../functions/postData";
import { EDIT_COMMENT } from "../../api/urls";

export const useEditCommentMutation = () => {
  const authContext = useAuthContext();

  const mutation = useMutation(
    async (input: unknown) => await postData(EDIT_COMMENT, input),
    {
      onSuccess: (res) => {
        if (res === "Success!") {
          authContext.setOpen(true);
          authContext.setMessage("Comment edited successfully!");
        }
      },
      onError: (error) => {
        authContext.setOpen(true);
        authContext.setError(error as string);
      },
      onSettled: () => authContext.setLoading(false),
    }
  );
  mutation.isLoading ? authContext.setLoading(true) : null;
  return mutation;
};
