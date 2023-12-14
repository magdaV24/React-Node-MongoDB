import { useMutation } from "react-query";
import postData from "../../functions/postData";
import { CLOUDINARY } from "../../cloudinary/cloudinary";
import { useAuthContext } from "../useAuthContext";

export const useCloudinaryMutation = () => {
  const authContext = useAuthContext();
  const mutation = useMutation(
    (input: unknown) => postData(CLOUDINARY, input),
    {
      onSettled: () => authContext.setLoading(false),
      onError: (error) => {
        authContext.setOpen(true);
        authContext.setError(error as string);
      },
    }
  );
  mutation.isLoading ? authContext.setLoading(true) : null;
  return mutation;
};
