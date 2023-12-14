import { useMutation } from "react-query";
import { DELETE_COMMENT } from "../../api/urls";
import postData from "../../functions/postData";
import { useAuthContext } from "../useAuthContext";

export const useDeleteCommentMutation = () => {
  const authContext = useAuthContext();

  const mutation = useMutation(
    async (input: unknown) => await postData(DELETE_COMMENT, input),
    {
      onSuccess: (res) => {
        if (res === "Success!") {
          authContext.setOpen(true);
          authContext.setMessage("Comment deleted successfully!");
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
