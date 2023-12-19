import { useMutation, useQueryClient } from "react-query";
import { ADD_COMMENT } from "../../api/urls";
import postData from "../../functions/postData";
import { useAuthContext } from "../useAuthContext";
import { CommentInput } from "../../interfaces/CommentsInput";

export const useAddCommentMutation = () => {
  const authContext = useAuthContext();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (input: CommentInput) => await postData(ADD_COMMENT, input),
    {
      onMutate: async (input: CommentInput) => {
        const context = { input };
        return context;
      },
      onSuccess(data, variables, context) {
          authContext.setMessage(data);
          authContext.setOpenMessage(true);

          const input = context?.input;
          queryClient.invalidateQueries(`fetchComments/${input?.parent_id}`)

      },
      onError: (error) => {
        authContext.setOpenMessage(true);
        authContext.setError(error as string);
      },
      // onSettled: () => authContext.setLoading(false),
    }
  );
  // mutation.isLoading ? authContext.setLoading(true) : null;
  const addCommentLoading = mutation.isLoading;
  return {mutation, addCommentLoading};
};
