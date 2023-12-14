import { useMutation } from "react-query";
import { DELETE_REVIEW } from "../../api/urls";
import postData from "../../functions/postData";
import { useAuthContext } from "../useAuthContext";

export const useDeleteReviewMutation = () => {
  const authContext = useAuthContext();

  const mutation = useMutation(
    async (input: unknown) => await postData(DELETE_REVIEW, input),
    {
      onSuccess: (res) => {
        if (res === "Success!") {
          authContext.setOpen(true);
          authContext.setMessage("Review deleted successfully!");
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
