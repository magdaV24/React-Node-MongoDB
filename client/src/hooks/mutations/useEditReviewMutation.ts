import { useMutation } from "react-query";
import { useAuthContext } from "../useAuthContext";
import { EDIT_REVIEW } from "../../api/urls";
import usePostDataWithToken from "../usePostDataWithToken";

function useEditReviewMutation ()  {
  const authContext = useAuthContext();
  const postData = usePostDataWithToken()
  const mutation = useMutation(
    async (input: unknown) => await postData(EDIT_REVIEW, input),
    {
      onSuccess: (res) => {
        if (res === "Success!") {
          authContext.setMessage("Review edited successfully!");
        }
      },
    }
  );
  const editReviewLoading = mutation.isLoading;

  return {mutation, editReviewLoading};
}

export default function useEditReview() {
  const {mutation, editReviewLoading} = useEditReviewMutation();

  const edit_review = async (input: unknown) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      console.log(`Error: ${error}`)
    }
  };
  return {edit_review, editReviewLoading};
}
