import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Material-UI imports
import { Container, Button, Box } from "@mui/material";

// Custom Hooks
import useQueryHook from "../hooks/useQueryHook";
import useGetUser from "../hooks/useGetUser";

// Custom Components
import AddReview from "../forms/AddReview";
import ReviewList from "../components/ReviewsList";

// The app's context
import { useAppContext } from "../hooks/useAppContext";

// URLs
import { FETCH_BOOK } from "../utils/urls";

// CSS imports
import "../styles/pages/bookPage.css";

// Types
import { Book } from "../types/Book";
import BookTable from "../components/book-page/BookTable";
import BookDescription from "../components/book-page/BookDescription";
import FixedCard from "../components/book-page/FixedCard";

interface Id {
  id: string | null;
}

export default function BookPage({ id }: Id) {
  const location = useLocation();

  const title: string = location.pathname
    .split("/")[1]
    .split("%20")
    .toString()
    .replace(/[",]/g, " ");

  const queryKey = `bookQuery/${id}`;
  const { data: book } = useQueryHook(`${FETCH_BOOK}/${title}`, queryKey);
  const appContext = useAppContext();

  const [open, setOpen] = useState(false);

  function onClose() {
    setOpen(false);
  }
  function handleSetOpen() {
    setOpen(true);
  }
  const [genres, setGenres] = useState("");

  const editGenres = (genres: string[]) => {
    const array = genres.join(", ");
    return setGenres(array);
  };

  useEffect(() => {
    if (book) {
      editGenres(book.genres);
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

  const user = useGetUser(id);

  return (
    <Container className="page-wrapper">
      {(book as Book) && (
        <>
          <Box className="book-wrapper">
            <FixedCard user={user} book={book} handleSetOpen={handleSetOpen} />
            <Box className="book-info">
              <Box className="book-table-wrapper">
                <BookDescription description={book.description} />
                <BookTable book={book} genres={genres} />
              </Box>
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
              {showReviews && <ReviewList bookId={book._id} userId={id} />}
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
}
