import { useMutation } from "react-query";
import { DELETE_PHOTO } from "../../api/urls";
import { useAuthContext } from "../useAuthContext";
import usePostDataWithToken from "../usePostDataWithToken";

function useDeletePhotoMutation () {
  const authContext = useAuthContext();
  const postData = usePostDataWithToken()
  const mutation = useMutation(
    async (input: unknown) => await postData(DELETE_PHOTO, input),
    {
      onSuccess: (res) => {
        if (
          res === "Could not find this book!" ||
          res === "Could not delete this photo!"
        ) {
          authContext.setError(res);
        } else {
          authContext.setMessage("Deleted this photo successfully!");
        }
      },
    }
  );
 const deletePhotoLoading = mutation.isLoading

  return {mutation, deletePhotoLoading};
}

export default function useDeletePhoto() {
  const {mutation, deletePhotoLoading} = useDeletePhotoMutation();

  const delete_photo = async (input: unknown) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      console.log(`Error: ${error}`)
    }
  };
  return {delete_photo, deletePhotoLoading};
}
