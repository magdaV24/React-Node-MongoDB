import { useEditReviewMutation } from "./mutations/useEditReviewMutation";

export default function useEditReview() {
  const mutation = useEditReviewMutation();

  const edit_review = async (input: unknown) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  return edit_review;
}
