import { useMutation, useQueryClient } from "react-query";
import { ADD_COMMENT } from "../../api/urls";
import { useAuthContext } from "../useAuthContext";
import { CommentInput } from "../../interfaces/CommentsInput";
import usePostData from "../usePostData";

function useAddCommentMutation() {
  const authContext = useAuthContext();
  const queryClient = useQueryClient();
  const postData = usePostData();
  const mutation = useMutation(
    async (input: CommentInput) => await postData(ADD_COMMENT, input),
    {
      onMutate: async (input: CommentInput) => {
        const context = { input };
        return context;
      },
      onSuccess(data, _variables, context) {
        authContext.setMessage(data);
        const input = context?.input;
        queryClient.invalidateQueries(`fetchComments/${input?.parent_id}`);
      },
    }
  );
  const addCommentLoading = mutation.isLoading;
  return { mutation, addCommentLoading };
}

export default function useAddComment() {
  const { mutation, addCommentLoading } = useAddCommentMutation();

  const add_comment = async (input: CommentInput) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };
  return { add_comment, addCommentLoading };
}
