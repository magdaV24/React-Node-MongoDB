import { useMutation } from "react-query";
import { CLOUDINARY } from "../../cloudinary/cloudinary";
import { useState } from "react";
import usePostData from "../usePostData";

  const useCloudinaryMutation = () => {
    const postData = usePostData();
    const mutation = useMutation((input: unknown) => postData(CLOUDINARY, input));
    return mutation;
  };


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
    console.log(`Error on useCloudinary: ${error}`)
  }
};
return submit_to_cloudinary;
}

