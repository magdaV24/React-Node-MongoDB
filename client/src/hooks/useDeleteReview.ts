import { useDeleteReviewMutation } from "./mutations/useDeleteReviewMutation";

export default function useDeleteReview() {
  const mutation = useDeleteReviewMutation();

  const delete_review = async (input: unknown) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  return delete_review;
}
