import { useDeleteCommentMutation } from "./mutations/useDeleteCommentMutation";

export default function useDeleteComment() {
  const mutation = useDeleteCommentMutation();

  const delete_comment = async (input: unknown) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  return delete_comment;
}
