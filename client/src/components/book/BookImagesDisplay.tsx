import { ImageList } from "@mui/material";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from "@cloudinary/react";
import { cloudinaryFnc } from "../../functions/cloudinaryFnc";

interface Props{
  photos: string[];
}
export default function BookImagesDisplay({ photos }: Props) {
  const cld = cloudinaryFnc();

  return (
    <ImageList
      sx={{ width: '100%', minHeight: 300, height: 'fit-content', p: 1.5 }}
      cols={5}
      rowHeight={164}>
      {photos &&
        photos.map((photo: string) => (
          <AdvancedImage
            cldImg={cld.image(photo).resize(fill().width(200).height(300))}
            key={photo}
          />
        ))}
    </ImageList>
  );
}
