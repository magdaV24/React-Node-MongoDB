import { useEditCommentMutation } from "./mutations/useEditCommentMutation";

export default function useEditComment() {
    const mutation = useEditCommentMutation()
  
    const edit_comment = async (input: unknown) => {
      try {
      await  mutation.mutateAsync(input);
      } catch (error) {
        throw new Error(`Error: ${error}`);
      }
    };
    return edit_comment;
  }