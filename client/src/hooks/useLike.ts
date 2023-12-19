import { LikeInput } from "../interfaces/LikeInput";
import { useLikeMutation } from "./mutations/useLikeMutation";

export default function useLike() {
  const {mutation, likeLoading} = useLikeMutation();

  const give_like = async (input: LikeInput) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  return {give_like, likeLoading};
}
