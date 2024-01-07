import { useMutation, useQueryClient } from "react-query";
import { useAuthContext } from "../useAuthContext";
import { ADD_BOOK } from "../../api/urls";
import usePostData from "../usePostData";

function useAddBookMutation ()  {
  const authContext = useAuthContext();
  const postData = usePostData();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (input: unknown) => await postData(ADD_BOOK, input),
    {
      onSuccess: (res) => {
          authContext.setMessage(res);
          queryClient.invalidateQueries("booksQuery");
      }
    }
  );
  const isLoading = mutation.isLoading
  return {mutation, isLoading};
}

export default function useAddBook() {
  const {mutation, isLoading} = useAddBookMutation()

  const add_book = async (input: unknown) => {
    try {
      await mutation.mutateAsync(input)
    } catch (error) {
      console.log(`Error on useAddBook: ${error}`);
    }
  };
  return {add_book, isLoading};
}