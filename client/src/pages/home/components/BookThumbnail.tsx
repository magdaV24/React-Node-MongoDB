import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from "@cloudinary/react";
import { Link } from "react-router-dom";
import { cloudinaryFnc } from "../../../functions/cloudinaryFnc";
import { BookThumbnailInterface } from "../../../interfaces/BookThumbnailInterface.";
import { card } from "../../../styles/bookThumbnail";

export default function BookThumbnail({image, title, author}: BookThumbnailInterface){
    const cld = cloudinaryFnc();

    return (
      <Card
        sx={card}
      >
        <CardMedia sx={{ height: 140 }}>
          <AdvancedImage
            cldImg={cld.image(image).resize(fill().width(150).height(250))}
          />
        </CardMedia>
        <CardContent sx={{ mt: 15 }}>
          <Link to={`/${title}`} style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
              {title}
          </Link>
          <Typography variant="body2" color="text.secondary">
            {author}
          </Typography>
        </CardContent>
      </Card>
    );
}