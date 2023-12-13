import { useAddCommentMutation } from "./mutations/useAddCommentMutation";

export default function useAddComment() {
  const mutation = useAddCommentMutation();

  const add_book = async (input: unknown) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  return add_book;
}
