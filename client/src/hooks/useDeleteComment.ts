import { CommentDeleteProps, useDeleteCommentMutation } from "./mutations/useDeleteCommentMutation";

export default function useDeleteComment() {
  const {mutation, deleteCommentLoading} = useDeleteCommentMutation();

  const delete_comment = async (input: CommentDeleteProps) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  return{ delete_comment, deleteCommentLoading};
}
