import { useAddReviewMutation } from "./mutations/useAddReviewMutation";

export default function useAddReview() {
  const mutation = useAddReviewMutation();

  const add_book = async (input: unknown) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  return add_book;
}
