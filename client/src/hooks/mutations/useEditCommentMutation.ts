import { useMutation } from "react-query";
import { useAuthContext } from "../useAuthContext";
import { EDIT_COMMENT } from "../../api/urls";
import usePostDataWithToken from "../usePostDataWithToken";

function useEditCommentMutation () {
  const authContext = useAuthContext();
  const postData = usePostDataWithToken()

  const mutation = useMutation(
    async (input: unknown) => await postData(EDIT_COMMENT, input),
    {
      onSuccess: (res) => {
        if (res === "Success!") {
          authContext.setMessage("Comment edited successfully!");
        }
      }
    }
  );
  const editCommentLoading = mutation.isLoading;
  return {mutation, editCommentLoading};
}

export default function useEditComment() {
  const { mutation, editCommentLoading } = useEditCommentMutation();

  const edit_comment = async (input: unknown) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      console.log(`Error: ${error}`)
    }
  };
  return { edit_comment, editCommentLoading };
}
