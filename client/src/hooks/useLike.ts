import { useLikeMutation } from "./mutations/useLikeMutation"

export default function useLike() {
    const mutation = useLikeMutation();
  
    const give_like = async (input: unknown) => {
      try {
      await  mutation.mutateAsync(input);
      } catch (error) {
        throw new Error(`Error: ${error}`);
      }
    };
    return give_like;
  }