import { useMutation } from "react-query";
import { DELETE_REVIEW } from "../../api/urls";
import { useAuthContext } from "../useAuthContext";
import usePostDataWithToken from "../usePostDataWithToken";

function useDeleteReviewMutation()  {
  const authContext = useAuthContext();
  const postData = usePostDataWithToken()

  const mutation = useMutation(
    async (input: unknown) => await postData(DELETE_REVIEW, input),
    {
      onSuccess: (res) => {
        if (res === "Success!") {
          authContext.setMessage("Review deleted successfully!");
        }
      },
      onError: (error) => {
        authContext.setError(error as string);
      },
    }
  );
 const deleteReviewLoading = mutation.isLoading
  return {mutation, deleteReviewLoading};
}

export default function useDeleteReview() {
  const {mutation, deleteReviewLoading} = useDeleteReviewMutation();

  const delete_review = async (input: unknown) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      console.log(`Error: ${error}`)
    }
  };
  return {delete_review, deleteReviewLoading};
}