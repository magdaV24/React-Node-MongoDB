import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { Container, Button, Box, CircularProgress } from "@mui/material";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import useDeletePhoto from "../../hooks/useDeletePhoto";
import ErrorAlert from "../../components/global/ErrorAlert";
import SuccessAlert from "../../components/global/SuccessAlert";
import { cloudinaryFnc } from "../../functions/cloudinaryFnc";

interface Props {
  photo: string;
  _id: string;
}

export default function EditPhotoCard({ photo, _id }: Props) {
  const cld = cloudinaryFnc();

  // Delete a photo

  const { loading, error, message } = useContext(AuthContext);
  const delete_photo = useDeletePhoto();
  const onSubmit = () => {
    const data = {
      id: _id,
      photo: photo,
    };
    try {
      delete_photo(data);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  return (
    <Container
      sx={{
        width: 220,
        height: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'column',
        gap: 1
      }}
    >
      <AdvancedImage
        cldImg={cld.image(photo).resize(fill().width(200).height(300))}
      />
      {loading ? (
        <Box>
          <CircularProgress />
        </Box>
      ) : (
        <Button
        color="warning"
        variant="contained"
        sx={{width: '100%', display: 'flex', alignItems: 'center', gap: 1}}
        >
          <DeleteSharpIcon onClick={onSubmit} /> DELETE
        </Button>
      )}
      {message && <SuccessAlert />}
      {error && <ErrorAlert />}
    </Container>
  );
}
