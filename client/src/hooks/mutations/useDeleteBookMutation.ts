import { useMutation, useQueryClient } from "react-query";
import { DELETE_BOOK } from "../../api/urls";
import { useAuthContext } from "../useAuthContext";
import usePostDataWithToken from "../usePostDataWithToken";

function useDeleteBookMutation () {
  const authContext = useAuthContext();
  const queryClient = useQueryClient();
  const postData = usePostDataWithToken()

  const mutation = useMutation(
    async (input: unknown) => await postData(DELETE_BOOK, input),
    {
      onSuccess: (res) => {
        if (res === "Success!") {
        authContext.setMessage("Book deleted successfully!");
        queryClient.invalidateQueries("booksQuery");}
      }}
  );
 const deleteBookLoading =  mutation.isLoading
  return{ mutation, deleteBookLoading};
}

export default function useDeleteBook() {
  const {mutation, deleteBookLoading }= useDeleteBookMutation();

  const delete_book = async (input: unknown) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      console.log(`Error: ${error}`)
    }
  };
  return {delete_book, deleteBookLoading};
}