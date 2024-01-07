import { useMutation } from "react-query";
import { ADD_PHOTO } from "../../api/urls";
import { useAuthContext } from "../useAuthContext";
import usePostData from "../usePostData";

function useAddPhotoMutation (){
  const authContext = useAuthContext();
  const postData = usePostData()
  const mutation = useMutation(
    async (input: unknown) => await postData(ADD_PHOTO, input),
    {
      onSuccess: (res) => {
        if (
          res === "Could not find this book!" ||
          res === "Something went wrong while trying to upload this photo!"
        ) {
          authContext.setError(res);
        } else {
          authContext.setMessage("Added this photo successfully!");
        }
      },
      onError: (error) => {
        authContext.setError(error as string);
      },
    }
  );
  const addPhotoLoading = mutation.isLoading 

  return {mutation, addPhotoLoading};
}
export default function useAddPhoto() {
  const {mutation, addPhotoLoading} = useAddPhotoMutation();

  const add_photo = async (input: unknown) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      console.log(`Error: ${error}`)
    }
  };
  return {add_photo, addPhotoLoading};
}
