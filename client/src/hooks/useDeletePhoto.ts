import { useDeletePhotoMutation } from "./mutations/useDeletePhotoMutation";

export default function useDeletePhoto() {
  const mutation = useDeletePhotoMutation();

  const delete_photo = async (input: unknown) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  return delete_photo;
}
