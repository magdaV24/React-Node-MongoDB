import { useDeleteBookMutation } from "./mutations/useDeleteBookMutation";

export default function useDeleteBook() {
  const mutation = useDeleteBookMutation();

  const delete_book = async (input: unknown) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  return delete_book;
}
