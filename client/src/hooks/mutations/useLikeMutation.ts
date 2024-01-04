import { useMutation, useQueryClient } from "react-query";
import { useAuthContext } from "../useAuthContext";
import postData from "../../functions/postData";
import { LIKE_OBJECT } from "../../api/urls";
import { LikeInput } from "../../interfaces/LikeInput";

export const useLikeMutation = () => {
  const authContext = useAuthContext();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (input: LikeInput) => await postData(LIKE_OBJECT, input),
    {
      onError: (error) => {
        authContext.setError(error as string);
        authContext.setOpenError(true);
      },
      onMutate: async (input: LikeInput) => {
        const context = { input };
        return context;
      },
      onSuccess: (context, variables, contextSnapshot) => {
        //Re-fetches the number of likes and check whether or not the user likes the object, so the component will be modified accordingly.
        const input: LikeInput = contextSnapshot?.input|| context?.input;
        const object_id = input?.object_id
        const user_id = input?.user_id
        queryClient.invalidateQueries(`likesCountQuery/${object_id}`);
        queryClient.invalidateQueries(
          `isLikedQuery/${user_id}/${object_id}`
        );
      },
    }
  );
 const likeLoading = mutation.isLoading;
  return {mutation, likeLoading};
};
