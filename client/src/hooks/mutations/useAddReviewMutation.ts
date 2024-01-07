import { useMutation } from "react-query";
import { ADD_REVIEW } from "../../api/urls";
import { useAuthContext } from "../useAuthContext";
import usePostDataWithToken from "../usePostDataWithToken";

function useAddReviewMutation() {
  const authContext = useAuthContext();
  const postData = usePostDataWithToken();
  const mutation = useMutation(
    async (input: unknown) => await postData(ADD_REVIEW, input),
    {
      onSuccess: (data) => {
        if (data === "Success!") {
          authContext.setMessage("Review sent successfully!");
        }
      },
    }
  );
  const reviewLoading = mutation.isLoading;
  return { mutation, reviewLoading };
}

export default function useAddReview() {
  const { mutation, reviewLoading } = useAddReviewMutation();

  const add_review = async (input: unknown) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };
  return { add_review, reviewLoading };
}
