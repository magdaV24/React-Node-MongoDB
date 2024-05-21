import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Material-UI imports
import {
  Container,
  CardHeader,
  Fab,
  CardContent,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Box,
} from "@mui/material";
import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import CreateSharpIcon from "@mui/icons-material/CreateSharp";

// Cloudinary imports
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { cloudinaryFnc } from "../utils/cloudinaryFnc";

// Custom Hooks
import useQueryHook from "../hooks/useQueryHook";
import useGetUser from "../hooks/useGetUser";

// Custom Components
import Grade from "../components/Grade";
import AddReview from "../forms/AddReview";
import ReviewList from "../components/ReviewsList";
import ReadingStatus from "../components/ReadingStatus";

// The app's context
import { useAppContext } from "../hooks/useAppContext";

// URLs
import { FETCH_BOOK } from "../utils/urls";

// CSS imports
import "../styles/pages/bookPage.css";

// Types
import { Book } from "../types/Book";


interface Id {
  id: string | null;
}

export default function BookPage({ id }: Id) {
  const location = useLocation();
  const cld = cloudinaryFnc();

  const title: string = location.pathname
    .split("/")[1]
    .split("%20")
    .toString()
    .replace(/[",]/g, " ");

  const queryName = "bookQuery";
  const { data: book } = useQueryHook(`${FETCH_BOOK}/${title}`, queryName);
  const appContext = useAppContext();

  const [open, setOpen] = useState(false);

  function onClose() {
    setOpen(false);
  }
  const [genres, setGenres] = useState("");

  const set_genres = (genres: string[]) => {
    const array = genres.join(", ");
    return setGenres(array);
  };

  useEffect(() => {
    if (book) {
      set_genres(book.genres);
    }
    if (appContext.error !== "") {
      appContext.setError(appContext.error);
    }
  }, [appContext, book, location.pathname]);

  const [showReviews, setShowReviews] = useState(false); // The user can choose if they want to see the reviews
  let show = "Show Reviews";

  if (showReviews) {
    show = "Hide Reviews";
  }
  // The carousel of the book's photos
  const [currentIndex, setCurrentIndex] = useState(0);

  const moveBack = (photos: string[]) => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };
  const moveForward = (photos: string[]) => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const user = useGetUser(id);

  return (
    <Container className="page-wrapper">
      {(book as Book) && (
        <>
          <Box className="book-wrapper">
            <Box
              sx={{ backgroundColor: "background.paper" }}
              className="book-card"
            >
              <CardHeader
                className="card-header"
                title={book.title}
                subheader={book.author}
              />
              <Box className="card-media">
                <Button
                  color="primary"
                  aria-label="back"
                  onClick={() => moveBack(book.photos)}
                  className="book-media-btn"
                >
                  <ArrowBackIosNewSharpIcon />
                </Button>

                <AdvancedImage
                  cldImg={cld
                    .image(book!.photos[currentIndex])
                    .resize(fill().width(230).height(350))}
                />

                <Button
                  color="primary"
                  aria-label="forward"
                  onClick={() => moveForward(book.photos)}
                  className="book-media-btn"
                >
                  <ArrowForwardIosSharpIcon />
                </Button>
              </Box>
              <Box className="book-grade-wrapper">
                <Grade grade={book.grade} />
              </Box>
              {user && (
                <Box className="reading-status-wrapper">
                  <ReadingStatus userId={id!} bookId={book.Id} />
                  <Fab
                    variant="extended"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    <CreateSharpIcon sx={{ mr: 1 }} />
                    Write a Review
                  </Fab>
                </Box>
              )}
            </Box>

            <Box className="book-info">
            <TableContainer className="book-table-wrapper">
              <Box className="book-synopsis-wrapper">
                <CardContent className="book-description">{book.description}</CardContent>
              </Box>
              <Box className="book-table">
                <TableHead sx={{width: '100%'}}>
                  <TableRow
                    sx={{ align: "left", backgroundColor: "secondary.dark", width: '100%' }}
                    
                  >
                    <TableCell sx={{align: "left",width: '10%',}}>Published:</TableCell>
                    <TableCell sx={{align: "left",width: '90%',}}>{book.published}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ align: "left", backgroundColor: "secondary.light" }}
                  >
                    <TableCell sx={{align: "left",width: '10%',}}>Pages:</TableCell>
                    <TableCell sx={{align: "left",width: '90%',}}>{book.pages}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ align: "left", backgroundColor: "secondary.dark" }}
                  >
                    <TableCell sx={{align: "left",width: '10%',}}>Genres:</TableCell>
                    <TableCell sx={{align: "left",width: '90%',}}>{genres}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ align: "left", backgroundColor: "secondary.light" }}
                  >
                    <TableCell sx={{align: "left",width: '10%',}}>Language:</TableCell>
                    <TableCell sx={{align: "left",width: '90%',}}>{book.language}</TableCell>
                  </TableRow>
                </TableHead>
              </Box>
            </TableContainer>
            {user && (
            <AddReview
              userId={id}
              bookId={book.Id}
              open={open}
              close={onClose}
            />
          )}
          <Button
            variant="outlined"
            onClick={() => setShowReviews((prev) => !prev)}
            className="show-reviews-button"
          >
            {show}
          </Button>
          {showReviews && <ReviewList bookId={book.Id} userId={id} />}
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
}
