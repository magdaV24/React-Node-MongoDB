import { useMutation } from "react-query";
import { useState } from "react";
import usePostData from "./usePostData";
import { CLOUDINARY } from "../utils/cloudinary";
/**
 * Designed to make the uploading to Cloudinary simpler. The submitToCloudinary function returns the public_id of the uploaded photo.
 * It catches the error, in case the uploading fails.
 */

const useCloudinaryMutation = () => {
  const postData = usePostData();
  const mutation = useMutation((input: unknown) => postData(CLOUDINARY, input));
  return mutation;
};

export default function useCloudinary() {
  const [, setId] = useState("");
  const mutation = useCloudinaryMutation();

  const submitToCloudinary = async (input: FormData) => {
    try {
      const result = await mutation.mutateAsync(input);
      const publicId = result?.data.public_id;
      setId(publicId);
      return publicId;
    } catch (error) {
      throw new Error(`Error on useCloudinary: ${error}`)
    }
  };
  return submitToCloudinary;
}