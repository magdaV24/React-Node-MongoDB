import { AdvancedImage } from "@cloudinary/react";
import {
  Container,
  Card,
  CardHeader,
  CardMedia,
  Fab,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Typography,
} from "@mui/material";
import { fill } from "@cloudinary/url-gen/actions/resize";
import Bar from "../../components/global/Bar";
import { useBook } from "../../hooks/queries/useBook";
import {
  book_page_wrapper,
  content_card,
  card_wrapper,
  container,
  content_card_wrapper,
  table_container,
} from "../../styles/bookPage";
import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import CreateSharpIcon from "@mui/icons-material/CreateSharp";
import { useContext, useEffect, useState } from "react";
import Login from "../../forms/Login";
import { AuthContext } from "../../context/AuthContextProvider";
import { useLocation } from "react-router-dom";
import { cloudinaryFnc } from "../../functions/cloudinaryFnc";
import ReviewForm from "../../forms/ReviewForm";
import Grade from '../../components/book/Grade'
import ReadingStatus from '../../components/book/ReadingStatus'
import ReviewList from "../../components/book/ReviewsList";
import { Book } from "../../types/Book";
import Backdrop from "../../components/global/Backdrop";

export default function BookPage() {
    const location = useLocation();
    const cld = cloudinaryFnc();

  const title: string = location.pathname
    .split("/")[1]
    .split("%20")
    .toString()
    .replace(/[",]/g, " ");
   
  const {  error } = useBook(title);
  const { currentUser, book, openBackdrop } = useContext(AuthContext);

  const [showReviews, setShowReviews] = useState(false); // The user can choose if they want to see the reviews
  let show = "Show Reviews";

  if (showReviews) {
    show = "Hide Reviews";
  }

    // Opening/Closing the modal that contains the review form
    const [open, setOpen] = useState(false);
    function close() {
      setOpen(false);
    }
  
    // Open the modal that contains the login form
    const [openLogin, setOpenLogin] = useState(false);
    const closeLogin = () => {
      setOpenLogin(false);
    };

      // The carousel of the book's photos
  const [currentIndex, setCurrentIndex] = useState(0);

  const moveBack = (photos: string[]) => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };
  const moveForward = (photos: string[]) => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  // Displays the genres in the table separated by commas;
  const [genres, setGenres] = useState("");

  const set_genres = (genres: string[]) => {
    const array = genres.join(", ");
    return setGenres(array);
  };

  useEffect(() => {
    if (book) {
      set_genres(book.genres);
    }
  }, [book, location.pathname]);
  if (error) return <Typography color="error">{error as string}</Typography>;

  return (
    <Container sx={book_page_wrapper}>
      <Bar />
      {(book as Book) && (
        <>
          <Container sx={container}>
            <Container sx={card_wrapper}>
              <Card sx={{ p: 2 }}>
                <CardHeader title={book.title} subheader={book.author} />
                <CardMedia>
                  <Fab
                    color="primary"
                    aria-label="back"
                    onClick={() => moveBack(book.photos)}
                    sx={{ mt: -30, mr: 1, width: "2.6vw", height: "5vh" }}
                  >
                    <ArrowBackIosNewSharpIcon />
                  </Fab>

                  <AdvancedImage
                    cldImg={cld
                      // .image(book.photos.length > 0 ? book.photos[currentIndex] : '')
                      .image((book as Book).photos[currentIndex] )
                      .resize(fill().width(150).height(250))}
                  />

                  <Fab
                    color="primary"
                    aria-label="forward"
                    onClick={() => moveForward(book.photos)}
                    sx={{ mt: -30, ml: 1, width: "2.6vw", height: "5vh" }}
                  >
                    <ArrowForwardIosSharpIcon />
                  </Fab>
                </CardMedia>
                <CardContent
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Grade grade={book.grade} />
                </CardContent>
              </Card>
            </Container>

            <Container
              sx={content_card_wrapper}
            >
              <Card
                sx={content_card}
              >
                <CardHeader subheader="Synopsis:" />
                <CardContent>{book.description}</CardContent>
              </Card>
            </Container>

            <TableContainer
              sx={table_container}
            >
              <Table>
                <TableHead>
                  <TableRow
                    sx={{ align: "left", backgroundColor: "secondary.dark" }}
                  >
                    <TableCell>Published:</TableCell>
                    <TableCell>{book.published}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ align: "left", backgroundColor: "secondary.light" }}
                  >
                    <TableCell>Pages:</TableCell>
                    <TableCell>{book.pages}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ align: "left", backgroundColor: "secondary.dark" }}
                  >
                    <TableCell>Genres:</TableCell>
                    <TableCell>{genres}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ align: "left", backgroundColor: "secondary.light" }}
                  >
                    <TableCell>Language:</TableCell>
                    <TableCell>{book.language}</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
              {currentUser && (
                <ReadingStatus user_id={currentUser.id} book_id={book._id} />
              )}
              {currentUser && (
                <Fab
                  variant="extended"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  <CreateSharpIcon sx={{ mr: 1 }} />
                  Write a Review
                </Fab>
              )}
            </TableContainer>
          </Container>
        </>
      )}
      {book && (
        <>
          {currentUser && (
            <ReviewForm book_id={book._id} open={open} close={close} />
          )}
          <Button
            variant="outlined"
            onClick={() => setShowReviews((prev) => !prev)}
            sx={{ ml: 3, mb: 2 }}
          >
            {show}
          </Button>
          {showReviews && <ReviewList book_id={book._id} />}
          <Login open={openLogin} handleClose={closeLogin} />
        </>
      )}
      {openBackdrop && <Backdrop />}
    </Container>
  );
}
