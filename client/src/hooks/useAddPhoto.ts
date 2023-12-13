import { useAddPhotoMutation } from "./mutations/useAddPhotoMutation";

export default function useAddPhoto() {
    const mutation = useAddPhotoMutation();
  
    const add_photo = async (input: unknown) => {
      try {
        await mutation.mutateAsync(input);
      } catch (error) {
        throw new Error(`Error: ${error}`);
      }
    };
    return add_photo;
  }