import { Button, Container, ImageList } from "@mui/material";
import { Book } from "../../../types/Book";

import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";

import ErrorAlert from "../../../components/ErrorAlert";
import { Controller, useForm } from "react-hook-form";
import postData from "../../../functions/postData";
import { CLOUDINARY, PRESET } from "../../../api/cloudinary";
import { ADD_PHOTO } from "../../../api/urls";
import { useMutation } from "react-query";
import EditPhotoCard from "./EditPhotoCard";

export default function EditBookPhotos({ photos, _id }: Book) {
  
  const {
    handleSubmit,
    formState: { errors },
    control,
    getValues
  } = useForm();

  // Add photo
  const cloudinary_mutation = useMutation(
    async (input: unknown) => await submit_to_cloudinary(input),
    {
      onSuccess: (data) => {
        const photo = data.public_id;
        const input = {
          photo: photo,
          id: _id
        }
        photo_mutation.mutate(input);
      },
    }
  );
  const photo_mutation = useMutation(
    async (input: unknown) => await add_photo(input));

  const submit_to_cloudinary = async (input: unknown) => {
    try {
      return await postData(CLOUDINARY, input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };

  const add_photo = async (input: unknown) => {
    try {
      return await postData(ADD_PHOTO, input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };

  const submitPhoto = () => {
    const photo = getValues("photo");
    if (photo === undefined) {
      return console.log("Undefined photo");
    }
    const formData = new FormData();

    formData.append("file", photo[0]);
    formData.append("upload_preset", PRESET);
    cloudinary_mutation.mutate(formData);
  }

  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        flexDirection: "row",
      }}
    >
      <ImageList
        sx={{ width: 750, minHeight: 380, height: 'fit-content' ,mt: 10, gap: 2 }}
        cols={3}
        rowHeight={350}
      >
        {photos &&
          photos.map((photo) => (
            <EditPhotoCard photo={photo} _id={_id} />
          ))}
      </ImageList>
      <Controller
        name="photo"
        control={control}
        render={({ field }) => (
          <input
            type="file"
            onChange={(e) => field.onChange(e.target.files)}
          />
        )}
      />

      <Button type="submit" onClick={handleSubmit(submitPhoto)}>
        <AddCircleOutlineSharpIcon sx={{ fontSize: "2rem" }} />
      </Button>

      {errors.photo && <ErrorAlert message={errors.photo.message as string} />}
    </Container>
  );
}
