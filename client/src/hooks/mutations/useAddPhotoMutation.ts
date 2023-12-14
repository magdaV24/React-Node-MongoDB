import { useMutation } from "react-query";
import { ADD_PHOTO } from "../../api/urls";
import postData from "../../functions/postData";
import { useAuthContext } from "../useAuthContext";

export const useAddPhotoMutation = () => {
  const authContext = useAuthContext();
  const mutation = useMutation(
    async (input: unknown) => await postData(ADD_PHOTO, input),
    {
      onSuccess: (res) => {
        if (
          res === "Could not find this book!" ||
          res === "Something went wrong while trying to upload this photo!"
        ) {
          authContext.setOpen(true);
          authContext.setError(res);
        } else {
          authContext.setOpen(true);
          authContext.setMessage("Added this photo successfully!");
        }
      },
      onError: (error) => {
        authContext.setError(error as string);
        authContext.setOpen(true);
      },
      onSettled: () => authContext.setLoading(false),
    }
  );
  mutation.isLoading ? authContext.setLoading(true) : null;

  return mutation;
};
