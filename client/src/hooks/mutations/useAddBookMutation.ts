import { useMutation, useQueryClient } from "react-query";
import postData from "../../functions/postData";
import { useAuthContext } from "../useAuthContext";
import { ADD_BOOK } from "../../api/urls";

export const useAddBookMutation = () => {
  const authContext = useAuthContext();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (input: unknown) => await postData(ADD_BOOK, input),
    {
      onSuccess: (res) => {
        if (
          res === "This book had already been added to the database!" ||
          res === "Fail!"
        ) {
          authContext.setOpen(true);
          authContext.setError(res);
          queryClient.invalidateQueries("booksQuery");
        } else {
          authContext.setOpen(true);
          authContext.setMessage("The book has been added to the database!");
        }
      },
      onError: (error) => {
        authContext.setError(error as string);
        authContext.setOpen(true);
      },
      onSettled: () => authContext.setLoading(false),
    }
  );
  const isLoading = mutation.isLoading
  return {mutation, isLoading};
};