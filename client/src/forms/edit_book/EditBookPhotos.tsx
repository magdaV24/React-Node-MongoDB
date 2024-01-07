import {
  Box,
  Button,
  CircularProgress,
  Container,
  ImageList,
} from "@mui/material";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import { Controller, useForm } from "react-hook-form";
import EditPhotoCard from "./EditPhotoCard";
import {  useEffect } from "react";
import { PRESET } from "../../cloudinary/cloudinary";
import { useAuthContext } from "../../hooks/useAuthContext";
import useAddPhoto from "../../hooks/mutations/useAddPhotoMutation";
import useCloudinary from "../../hooks/mutations/useCloudinaryMutation";

interface Props {
  photos: string[];
  _id: string;
}

export default function EditBookPhotos({ photos, _id }: Props) {
  const {
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm();

  const authContext = useAuthContext();

  // Add photo
  const submit_to_cloudinary = useCloudinary();
  const {add_photo, addPhotoLoading} = useAddPhoto();

  const onSubmit = async () => {
    const photo = getValues("photo");
    if (photo === undefined) {
      return console.log("Undefined photo");
    }
    const formData = new FormData();

    formData.append("file", photo[0]);
    formData.append("upload_preset", PRESET);
    try {
      const id = await submit_to_cloudinary(formData);

      const input = {
        photo: id,
        id: _id,
      };

      add_photo(input);
    } catch (error) {
      console.log(`Error: ${error}`)
    }
  };
  useEffect(() => {
    if (errors.photo) authContext.setError(errors.photo.message as string);
  }, [authContext, errors.photo]);
  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        flexDirection: "column"
      }}
    >
      <ImageList
        sx={{
          width: 750,
          minHeight: 380,
          height: "fit-content",
          mt: 10,
          gap: 2,
        }}
        cols={3}
        rowHeight={350}
      >
        {photos &&
          photos.map((photo: string) => (
            <EditPhotoCard photo={photo} _id={_id} />
          ))}
      </ImageList>
<Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>      <Controller
        name="photo"
        control={control}
        render={({ field }) => (
          <Button variant="contained" size='large'>
            <input type="file" onChange={(e) => field.onChange(e.target.files)} /> UPLOAD PHOTO
          </Button>
        )}
      />
      {addPhotoLoading ? (
        <Button>
          <CircularProgress />
        </Button>
      ) : (
        <Button type="submit" onClick={handleSubmit(onSubmit)} variant="outlined" size='large'>
          <AddCircleOutlineSharpIcon sx={{ fontSize: "2rem" }} /> ADD PHOTO
        </Button>
      )}</Box>
    </Container>
  );
}