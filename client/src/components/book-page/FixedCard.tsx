import { AdvancedImage } from "@cloudinary/react";
import { Box, CardHeader, Button } from "@mui/material";
import { useState } from "react";
import Grade from "../Grade";

import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";

import { fill } from "@cloudinary/url-gen/actions/resize";
import { cloudinaryFnc } from "../../utils/cloudinaryFnc";
import { User } from "../../types/User";
import { Book } from "../../types/Book";
import ReadingStatusWrapper from "./ReadingStatusWrapper";
import PhotoDisplay from "./PhotoDisplay";

interface Props {
  user: User;
  book: Book;
  handleSetOpen: () => void;
}
export default function FixedCard({ book, user, handleSetOpen }: Props) {
  const cld = cloudinaryFnc();

  // The carousel of the book's photos
  const [currentIndex, setCurrentIndex] = useState(0);

  const moveBack = (photos: string[]) => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };
  const moveForward = (photos: string[]) => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const [showPhoto, setShowPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");

  const handleShowPhoto = (url: string) => {
    setShowPhoto(true);
    setPhotoUrl(url);
  };

  const handleClosePhoto = () => {
    setShowPhoto(false);
    setPhotoUrl("");
  };

  return (
    <Box sx={{ backgroundColor: "background.paper" }} className="book-card">
      <CardHeader
        className="card-header"
        title={book!.title}
        subheader={book!.author}
      />
      <Box className="card-media">
        <Button
          color="primary"
          aria-label="back"
          onClick={() => moveBack(book!.photos)}
          className="book-media-btn"
        >
          <ArrowBackIosNewSharpIcon />
        </Button>

        <AdvancedImage
          onClick={() => handleShowPhoto(book!.photos[currentIndex])}
          cldImg={cld
            .image(book!.photos[currentIndex])
            .resize(fill().width(230).height(350))}
        />

        <Button
          color="primary"
          aria-label="forward"
          onClick={() => moveForward(book!.photos)}
          className="book-media-btn"
        >
          <ArrowForwardIosSharpIcon />
        </Button>
      </Box>
      <Box className="book-grade-wrapper">
        <Grade grade={book!.grade} />
      </Box>
      {user && (
        <ReadingStatusWrapper
          handleSetOpen={handleSetOpen}
          id={user._id}
          book={book}
        />
      )}

      <PhotoDisplay
        open={showPhoto}
        onClose={handleClosePhoto}
        photoURL={photoUrl}
      />
    </Box>
  );
}
