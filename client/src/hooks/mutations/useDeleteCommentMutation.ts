import { useMutation, useQueryClient } from "react-query";
import { DELETE_COMMENT } from "../../api/urls";
import { useAuthContext } from "../useAuthContext";
import usePostDataWithToken from "../usePostDataWithToken";

export interface CommentDeleteProps{
  id: string;
  parent_id: string;
}

function useDeleteCommentMutation () {
  const authContext = useAuthContext();
  const queryClient = useQueryClient();
  const postData = usePostDataWithToken();

  const mutation = useMutation(
    async (input: CommentDeleteProps) => await postData(DELETE_COMMENT, input),
    {
      onMutate: async (input: CommentDeleteProps) => {
        const context = { input };
        return context;
      },
      onSuccess: (data, _variables, context) => {
        if (data === "Success!") {
          authContext.setMessage("Comment deleted successfully!");
        }
        const input =  context?.input
        queryClient.invalidateQueries(`fetchComments/${input!.parent_id}`);
      },
    }
  );
  const deleteCommentLoading = mutation.isLoading;
  return {mutation, deleteCommentLoading};
}

export default function useDeleteComment() {
  const {mutation, deleteCommentLoading} = useDeleteCommentMutation();

  const delete_comment = async (input: CommentDeleteProps) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      console.log(`Error: ${error}`)
    }
  };
  return{ delete_comment, deleteCommentLoading};
}