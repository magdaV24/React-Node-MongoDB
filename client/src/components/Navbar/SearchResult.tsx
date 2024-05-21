import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { Box, Typography } from "@mui/material";
import { cloudinaryFnc } from "../../utils/cloudinaryFnc";
import '../../styles/components/navbar.css'

interface Props {
  title: string;
  author: string;
  photo: string[];
}

export default function SearchResult({ title, author, photo }: Props) {
  const cld = cloudinaryFnc();

  return (
    <Box className="search-result">
      <AdvancedImage
        cldImg={cld.image(photo[0]).resize(fill().width(40).height(50))}
      />
      <Typography>
        <a href={title}>{title}</a>
      </Typography>
      <Typography>{author}</Typography>
    </Box>
  );
}
