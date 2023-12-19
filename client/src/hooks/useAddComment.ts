import { CommentInput } from "../interfaces/CommentsInput";
import { useAddCommentMutation } from "./mutations/useAddCommentMutation";

export default function useAddComment() {
  const {mutation, addCommentLoading} = useAddCommentMutation();

  const add_comment = async (input: CommentInput) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  return {add_comment, addCommentLoading};
}
