import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { cloudinaryFnc } from "../../functions/cloudinaryFnc";

interface Props{
    title: string;
    author: string;
    photo: string[];
}

export default function SearchResult({title, author, photo}: Props){
  const cld = cloudinaryFnc();
  const handleClick = () => {
    setTimeout(() => {
        window.location.reload();
      }, 200);
  };

    return(
        <Link to={`/${title}`} style={{ textDecoration: 'none', color: 'inherit', }} onClick={handleClick}>
            <Container sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, gap: 1}}>
            <AdvancedImage
                  cldImg={cld
                    .image(photo[0])
                    .resize(fill().width(40).height(50))}
            />
            <Typography>{title}</Typography>
            <Typography>{author}</Typography>
        </Container>
        </Link>
    )
}