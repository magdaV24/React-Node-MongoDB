import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { Container, Button } from "@mui/material";
import { cloudinaryFnc } from "../../../functions/cloudinaryFnc";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import { useMutation } from "react-query";
import postData from "../../../functions/postData";
import { DELETE_PHOTO } from "../../../api/urls";

interface Props {
  photo: string;
  _id: string
}

export default function EditPhotoCard({ photo, _id }: Props) {
  const cld = cloudinaryFnc();

  // Delete a photo

  const delete_mutation = useMutation((input: unknown) => delete_photo(input))

  const delete_photo = async (input: unknown) => {
    try {
        return await postData(DELETE_PHOTO, input)
    } catch (error) {
        throw new Error(`Error: ${error}`)
    }
  }

  const deletePhoto = () => {
    const data = {
        id: _id,
        photo: photo
    }
    delete_mutation.mutate(data)
  }
  return (
    <Container
      sx={{
        width: 220,
        height: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AdvancedImage
        cldImg={cld.image(photo).resize(fill().width(200).height(300))}
      />
      <Button
        sx={{ width: 3, mt: 37, color: "red", ml: -5, backgroundColor: '#EF424C' }}
        color="warning"
      >
        <DeleteSharpIcon onClick={deletePhoto} />
      </Button>
    </Container>
  );
}
