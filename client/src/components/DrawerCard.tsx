import { AdvancedImage } from "@cloudinary/react";
import { Box, Avatar, Typography } from "@mui/material";
import { cloudinaryFnc } from "../utils/cloudinaryFnc";
interface Props {
  title: string;
  author: string;
  photo: string;
}
export default function DrawerCard({ title, author, photo }: Props) {
  const cld = cloudinaryFnc();
  return (
    <Box className="drawer-card" sx={{ backgroundColor: "primary.dark" }}>
      <Box className="drawer-card-header-wrapper">
        <Avatar aria-label="avatar" className="avatar">
          {title[0]}
        </Avatar>
        <Box className="drawer-card-header">
          <Typography>{title}</Typography>
          <Typography>{author}</Typography>
        </Box>
      </Box>
      <Box className="drawer-card-media-wrapper">
        <AdvancedImage
          cldImg={cld.image(photo)}
          className="drawer-card-media"
        />
      </Box>
    </Box>
  );
}
