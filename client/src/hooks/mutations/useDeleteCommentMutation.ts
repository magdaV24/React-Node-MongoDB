import { useMutation, useQueryClient } from "react-query";
import { DELETE_COMMENT } from "../../api/urls";
import postData from "../../functions/postData";
import { useAuthContext } from "../useAuthContext";

export interface CommentDeleteProps{
  id: string;
  parent_id: string;
}

export const useDeleteCommentMutation = () => {
  const authContext = useAuthContext();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (input: CommentDeleteProps) => await postData(DELETE_COMMENT, input),
    {
      onMutate: async (input: CommentDeleteProps) => {
        const context = { input };
        return context;
      },
      onSuccess: (data, variables, context) => {
        if (data === "Success!") {
          authContext.setOpenMessage(true);
          authContext.setMessage("Comment deleted successfully!");
        }
        const input =  context?.input
        queryClient.invalidateQueries(`fetchComments/${input!.parent_id}`);
      },
      onError: (error) => {
        authContext.setOpenError(true);
        authContext.setError(error as string);
      },
    }
  );
  const deleteCommentLoading = mutation.isLoading;
  return {mutation, deleteCommentLoading};
};