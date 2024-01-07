import { useMutation, useQueryClient } from "react-query";
import { useAuthContext } from "../useAuthContext";
import { LIKE_OBJECT } from "../../api/urls";
import { LikeInput } from "../../interfaces/LikeInput";
import usePostDataWithToken from "../usePostDataWithToken";

function useLikeMutation () {
  const authContext = useAuthContext();
  const queryClient = useQueryClient();
  const postData = usePostDataWithToken()

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
      onSuccess: (context, _variables, contextSnapshot) => {
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
}

export default function useLike() {
  const {mutation, likeLoading} = useLikeMutation();

  const give_like = async (input: LikeInput) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      console.log(`Error: ${error}`)
    }
  };
  return {give_like, likeLoading};
}
