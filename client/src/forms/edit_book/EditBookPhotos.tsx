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
import useCloudinary from "../../hooks/useCloudinary";
import useAddPhoto from "../../hooks/useAddPhoto";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import SuccessAlert from "../../components/global/SuccessAlert";
import ErrorAlert from "../../components/global/ErrorAlert";
import { PRESET } from "../../cloudinary/cloudinary";
import { useAuthContext } from "../../hooks/useAuthContext";

interface Props {
  photos: [];
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
  const { loading, error, message } = useContext(AuthContext);

  // Add photo
  const submit_to_cloudinary = useCloudinary();
  const add_photo = useAddPhoto();

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
      throw new Error(`Error: ${error}`);
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
        flexDirection: "row",
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
      <Controller
        name="photo"
        control={control}
        render={({ field }) => (
          <input type="file" onChange={(e) => field.onChange(e.target.files)} />
        )}
      />
      {loading ? (
        <Box>
          <CircularProgress />
        </Box>
      ) : (
        <Button type="submit" onClick={handleSubmit(onSubmit)}>
          <AddCircleOutlineSharpIcon sx={{ fontSize: "2rem" }} />
        </Button>
      )}
      {message && <SuccessAlert />}
      {error && <ErrorAlert />}
    </Container>
  );
}