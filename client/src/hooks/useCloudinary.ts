import { useState } from "react";
import { useCloudinaryMutation } from "./mutations/useCloudinaryMutation";

export default function useCloudinary() {
    const [, setId] = useState('')
  const mutation = useCloudinaryMutation()

  const submit_to_cloudinary = async (input: FormData) => {
    try {
    const result = await mutation.mutateAsync(input);
    const publicId = result.public_id;
    setId(publicId);
    return publicId;
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  return submit_to_cloudinary;
}