import { useAddBookMutation } from "./mutations/useAddBookMutation";

export default function useAddBook() {
    const mutation = useAddBookMutation()
  
    const add_book = async (input: unknown) => {
      try {
        await mutation.mutateAsync(input)
      } catch (error) {
        throw new Error(`Error: ${error}`);
      }
    };
    return add_book;
  }