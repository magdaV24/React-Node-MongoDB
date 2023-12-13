import { useMutation } from "react-query";
import { useAuthContext } from "../useAuthContext";
import postData from "../../functions/postData";
import { EDIT_REVIEW } from "../../api/urls";

export const useEditReviewMutation = () => {
  const authContext = useAuthContext();
  const mutation = useMutation(
    async (input: unknown) => await postData(EDIT_REVIEW, input),
    {
      onSuccess: (res) => {
        if (res === "Success!")
          authContext.setMessage("Review edited successfully!");
      },
      onError: (error) => authContext.setError(error as string),
      onSettled: () => authContext.setLoading(false),
    }
  );
  mutation.isLoading ? authContext.setLoading(true) : null;

  return mutation;
};
