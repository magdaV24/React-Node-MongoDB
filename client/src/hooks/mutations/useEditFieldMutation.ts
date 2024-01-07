import { useMutation } from "react-query";
import { EDIT_FIELD } from "../../api/urls";
import { useAuthContext } from "../useAuthContext";
import usePostDataWithToken from "../usePostDataWithToken";

function useEditFieldMutation ()  {
  const authContext = useAuthContext();
  const postData = usePostDataWithToken()

  const mutation = useMutation(
    async (input: unknown) => await postData(EDIT_FIELD, input),
    {
      onSuccess: (res) => {
        if (
          res === "Could not find this book!" ||
          res === "Something went wrong while trying to edit this field!"
        ) {
          authContext.setError(res);
        } else {
          authContext.setMessage("Field edited successfully!");
        }
      }
    }
  );
  const editFieldLoading = mutation.isLoading
  return {mutation, editFieldLoading};
}

export default function useEditField() {
  const {mutation, editFieldLoading} = useEditFieldMutation()

  const edit_field = async (input: unknown) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      console.log(`Error: ${error}`)
    }
  };
  return {edit_field, editFieldLoading};
}