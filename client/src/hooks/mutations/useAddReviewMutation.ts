import { useMutation } from "react-query";
import { ADD_REVIEW } from "../../api/urls";
import { useAuthContext } from "../useAuthContext";
import usePostData from "../usePostData";

function useAddReviewMutation()  {
  const authContext = useAuthContext();
  const postData = usePostData();
  const mutation = useMutation(
    async (input: unknown) => await postData(ADD_REVIEW, input),
    {
      onSuccess: (data) => {
        if (data === "You had already given a review!") {
          authContext.setOpenError(true);
          authContext.setError(data);
        } else {
          authContext.setOpenMessage(true);
          authContext.setMessage("Review sent successfully!");
        }
      },
      onError: (error) => {
        authContext.setOpenError(true);
        authContext.setError(error as string);
      },
    }
  );
  const reviewLoading = mutation.isLoading
  return {mutation, reviewLoading};
}

export default function useAddReview() {
  const {mutation, reviewLoading} = useAddReviewMutation();

  const add_review = async (input: unknown) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      console.log(`Error: ${error}`)
    }
  };
  return {add_review, reviewLoading};
}