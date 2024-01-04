import { useAddReviewMutation } from "./mutations/useAddReviewMutation";

export default function useAddReview() {
  const {mutation, reviewLoading} = useAddReviewMutation();

  const add_review = async (input: unknown) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  return {add_review, reviewLoading};
}
