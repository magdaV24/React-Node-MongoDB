import { AdvancedImage } from "@cloudinary/react";
import { Card, CardHeader, Avatar, CardMedia } from "@mui/material";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { cloudinaryFnc } from "../utils/cloudinaryFnc";
interface Props {
  title: string;
  author: string;
  photo: string;
}
export default function DrawerCard({ title, author, photo }: Props) {
  const cld = cloudinaryFnc();
  return (
    <Card sx={{ width: 250, height: 350, p: 1 }}>
      <CardHeader
        avatar={<Avatar aria-label="avatar">R</Avatar>}
        title={title}
        subheader={author}
      />
      <CardMedia
        sx={{
          height: 300,
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <AdvancedImage
          cldImg={cld.image(photo).resize(fill().width(150).height(230))}
        />
      </CardMedia>
    </Card>
  );
}
