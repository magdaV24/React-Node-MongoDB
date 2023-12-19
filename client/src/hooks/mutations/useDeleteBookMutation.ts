import { useMutation, useQueryClient } from "react-query";
import { DELETE_BOOK } from "../../api/urls";
import postData from "../../functions/postData";
import { useAuthContext } from "../useAuthContext";

export const useDeleteBookMutation = () => {
  const authContext = useAuthContext();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (input: unknown) => await postData(DELETE_BOOK, input),
    {
      onSuccess: (res) => {
        if (res === "Success!") authContext.setOpen(true);
        authContext.setMessage("Book deleted successfully!");
        queryClient.invalidateQueries("booksQuery");
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
