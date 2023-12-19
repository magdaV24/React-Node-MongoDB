import { useMutation } from "react-query";
import { ADD_REVIEW } from "../../api/urls";
import postData from "../../functions/postData";
import { useAuthContext } from "../useAuthContext";

export const useAddReviewMutation = () => {
  const authContext = useAuthContext();
  const mutation = useMutation(
    async (input: unknown) => await postData(ADD_REVIEW, input),
    {
      onSuccess: (data) => {
        if (data === "You had already given a review!") {
          authContext.setOpenError(true);
          authContext.setError(data);
        } else {
          authContext.setOpenMessage(true);
          authContext.setMessage("Review was sent successfully!");
        }
      },
      onError: (error) => {
        authContext.setOpenError(true);
        authContext.setError(error as string);
      },
      onSettled: () => authContext.setLoading(false),
    }
  );
  mutation.isLoading ? authContext.setLoading(true) : null;
  return mutation;
};
