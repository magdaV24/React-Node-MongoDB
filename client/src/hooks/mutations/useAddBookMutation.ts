import { useMutation } from "react-query";
import postData from "../../functions/postData";
import { useAuthContext } from "../useAuthContext";
import { ADD_BOOK } from "../../api/urls";

export const useAddBookMutation = () => {
  const authContext = useAuthContext();
  const mutation = useMutation(
    async (input: unknown) => await postData(ADD_BOOK, input),
    {
      onSuccess: (res) => {
        if (
          res === "This book had already been added to the database!" ||
          res === "Fail!"
        ) {
          authContext.setError(res);
        } else {
          authContext.setMessage("The book has been added to the database!");
        }
      },
      onError: (error) => authContext.setError(error as string),
      onSettled: () => authContext.setLoading(false),
    }
  );
  mutation.isLoading ? authContext.setLoading(true) : null;
  return mutation;
};