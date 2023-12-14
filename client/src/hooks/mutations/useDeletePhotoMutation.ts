import { useMutation } from "react-query";
import { DELETE_PHOTO } from "../../api/urls";
import postData from "../../functions/postData";
import { useAuthContext } from "../useAuthContext";

export const useDeletePhotoMutation = () => {
  const authContext = useAuthContext();
  const mutation = useMutation(
    async (input: unknown) => await postData(DELETE_PHOTO, input),
    {
      onSuccess: (res) => {
        if (
          res === "Could not find this book!" ||
          res === "Could not delete this photo!"
        ) {
          authContext.setOpen(true);
          authContext.setError(res);
        } else {
          authContext.setOpen(true);
          authContext.setMessage("Deleted this photo successfully!");
        }
      },
      onError: (error) => {
        authContext.setOpen(true);
        authContext.setError(error as string);
      },
      onSettled: () => authContext.setLoading(false),
    }
  );
  mutation.isLoading ? authContext.setLoading(true) : null;

  return mutation;
};
