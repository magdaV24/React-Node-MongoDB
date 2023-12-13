import { ImageList } from "@mui/material";
import { Book } from "../../../types/Book";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from "@cloudinary/react";
import { cloudinaryFnc } from "../../../functions/cloudinaryFnc";

export default function BookImagesDisplay({ photos }: Book) {
  const cld = cloudinaryFnc();

  return (
    <ImageList
      sx={{ width: 650, minHeight: 300, height: 'fit-content', mt: 10 }}
      cols={3}
      rowHeight={164}
    >
      {photos &&
        photos.map((photo) => (
          <AdvancedImage
            cldImg={cld.image(photo).resize(fill().width(200).height(300))}
            key={photo}
          />
        ))}
    </ImageList>
  );
}
